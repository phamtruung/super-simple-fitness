//#region InOutChart
class InOutChart {
    constructor(svgElement, inList, outList, timeList, config) {
        this.svg = svgElement;
        this.inList = inList;
        this.outList = outList;
        this.timeList = timeList;
        this.config = config;

        this.height = config.sizes.svgHeight;

        // Bắt buộc để browser tính width đúng
        this.svg.style.width = "100%";
        this.svg.style.height = `${this.height}px`;
        this.svg.style.display = "block"; // tránh inline svg gây width bất thường
        this.svg.style.background = this.config.colors.background;

        // Quan sát kích thước container để re-render
        this.resizeObserver = new ResizeObserver(() => {
        this.safeRender();
        });
        this.resizeObserver.observe(this.svg);
    }
    el(tag, attrs = {}) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (v === null || v === undefined) continue;
            const val = typeof v === 'number' ? (Number.isFinite(v) ? String(v) : null) : String(v);
            if (val !== null) node.setAttribute(k, val);
        }
        return node;
    }
    getActualWidth() {
        // Ưu tiên boundingClientRect; nếu 0, thử clientWidth
        const w = this.svg.getBoundingClientRect().width || this.svg.clientWidth || 0;
        return Math.max(0, Math.floor(w));
    }
    scaleX(i, monthGap) {
        return this.config.sizes.marginLeft + i * monthGap;
    }
    scaleY(val, maxVal) {
        const innerHeight = this.height - this.config.sizes.marginTop - this.config.sizes.marginBottom;
        if (maxVal <= 0) {
            // fallback: vẽ tất cả ở baseline
            return this.config.sizes.marginTop + innerHeight;
        }
        return this.config.sizes.marginTop + innerHeight - (val / maxVal) * innerHeight;
    }
    // Render an toàn: nếu width=0 thì chờ đến khi có width > 0
    safeRender(maxWaitMs = 1000) {
        const start = performance.now();
        const tick = () => {
            const w = this.getActualWidth();
            if (w > 0) {
                this.render();
                return;
            }
            if (performance.now() - start >= maxWaitMs) {
                // fallback: đặt width giả định để không trắng trang
                this.svg.style.minWidth = "320px";
                this.render();
                return;
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    render() {
        const actualWidth = this.getActualWidth();
        if (!actualWidth) return; // bảo vệ lần gọi sớm

        this.svg.innerHTML = ""; // xoá chart cũ

        const difference = this.inList.map((val,i)=>val-this.outList[i]);
        let maxVal = Math.max(...this.inList, ...this.outList, ...difference);
        if (maxVal <= 0) {
            maxVal = 1; // tránh chia cho 0
        }

        const innerHeight = this.height - this.config.sizes.marginTop - this.config.sizes.marginBottom;

        // khoảng cách động theo width thực tế
        const monthGap = (actualWidth - this.config.sizes.marginLeft - this.config.sizes.marginRight) / this.timeList.length;
        const barWidth = 20; // giữ bar cố định
        const offset = 5;    // expense lệch sang phải 1 chút

        // Vẽ bar (income dưới, expense trên)
        this.timeList.forEach((m,i)=>{
        const xBase = this.scaleX(i, monthGap);
        const yIncome = this.scaleY(this.inList[i], maxVal);
        const yExpense = this.scaleY(this.outList[i], maxVal);

        // Income bar (click to toggle its value label)
        const incomeRect = this.el('rect',{
            x:xBase,
            y:yIncome,
            width:barWidth,
            height:this.config.sizes.marginTop+innerHeight-yIncome,
            fill:this.config.colors.income,
            rx:this.config.sizes.barRadius,
            ry:this.config.sizes.barRadius,
            style: 'cursor: pointer;'
        });
        this.svg.appendChild(incomeRect);

        // Income value label (hidden until click)
        const incomeLabelY = Math.max(this.config.sizes.marginTop + 8, yIncome - 6);
        const incomeLabel = this.el('text',{
            x: xBase + barWidth/2,
            y: incomeLabelY,
            fill: this.config.colors.label,
            'text-anchor': 'middle',
            visibility: 'hidden'
        });
        incomeLabel.textContent = Number(this.inList[i]).toLocaleString();
        this.svg.appendChild(incomeLabel);

        incomeRect.addEventListener('click', () => {
            const v = incomeLabel.getAttribute('visibility') || 'hidden';
            incomeLabel.setAttribute('visibility', v === 'visible' ? 'hidden' : 'visible');
        });

        // hover effect for income
        const incomeOrigFill = incomeRect.getAttribute('fill') || this.config.colors.income;
        const hoverColor = (this.config.colors && this.config.colors.hover) ? this.config.colors.hover : 'gray';
        incomeRect.addEventListener('mouseover', () => {
            incomeRect.setAttribute('fill', hoverColor);
        });
        incomeRect.addEventListener('mouseout', () => {
            incomeRect.setAttribute('fill', incomeOrigFill);
        });

        // Expense bar (click to toggle its value label)
        const expenseRect = this.el('rect',{
            x:xBase + offset,
            y:yExpense,
            width:barWidth,
            height:this.config.sizes.marginTop+innerHeight-yExpense,
            fill:this.config.colors.expense,
            rx:this.config.sizes.barRadius,
            ry:this.config.sizes.barRadius,
            style: 'cursor: pointer;'
        });
        this.svg.appendChild(expenseRect);

        // Expense value label (hidden until click)
        const expenseLabelY = Math.max(this.config.sizes.marginTop + 8, yExpense - 6);
        const expenseLabel = this.el('text',{
            x: xBase + offset + barWidth/2,
            y: expenseLabelY,
            fill: this.config.colors.label,
            'text-anchor': 'middle',
            'font-size': '12',
            visibility: 'hidden'
        });
        expenseLabel.textContent = Number(this.outList[i]).toLocaleString();
        this.svg.appendChild(expenseLabel);

        expenseRect.addEventListener('click', () => {
            const v = expenseLabel.getAttribute('visibility') || 'hidden';
            expenseLabel.setAttribute('visibility', v === 'visible' ? 'hidden' : 'visible');
        });

        // hover effect for expense
        const expenseOrigFill = expenseRect.getAttribute('fill') || this.config.colors.expense;
        expenseRect.addEventListener('mouseover', () => {
            expenseRect.setAttribute('fill', hoverColor);
        });
        expenseRect.addEventListener('mouseout', () => {
            expenseRect.setAttribute('fill', expenseOrigFill);
        });

        const label = this.el('text',{
            x:xBase + barWidth/2,
            y:this.config.sizes.marginTop+innerHeight+20,
            fill:this.config.colors.label,
            'text-anchor':'middle'
        });
        label.textContent = m;
        this.svg.appendChild(label);
        });

        // Line Difference
        const pathD = difference.map((d,i)=>{
            const x = this.scaleX(i, monthGap)+barWidth/2;
            const y = this.scaleY(d, maxVal);
            return `${i===0?'M':'L'} ${x} ${y}`;
        }).join(' ');

        this.svg.appendChild(this.el('path',{
            d:pathD,
            stroke:this.config.colors.difference,
            'stroke-width':1,
            fill:'none',
            'stroke-dasharray': '4 2'
        }));

        // Points Difference
        difference.forEach((d,i)=>{
            console.log(d)
            this.svg.appendChild(this.el('circle',{
                cx:this.scaleX(i, monthGap)+barWidth/2,
                cy:this.scaleY(d,maxVal),
                r:this.config.sizes.pointRadius,
                fill:this.config.colors.difference,
                stroke:'#fff',
                'stroke-width':1.5,
            }));

            if (d !=0 ){
                const label = this.el('text', {
                    x:this.scaleX(i, monthGap)+barWidth/2,
                    y:this.scaleY(d,maxVal) - 8,
                    fill:this.config.colors.label,
                    'text-anchor':'middle'
                });
                label.textContent = d;
                this.svg.appendChild(label);
            }

        });
    }
}
//#region BarChart
class BarChart {
    constructor(svgElement, inList, targetValue, timeList, config) {
        this.svg = svgElement;
        this.inList = inList;
        this.timeList = timeList;
        this.targetValue = targetValue;
        this.config = config;

        this.height = config.sizes.svgHeight;

        // Bắt buộc để browser tính width đúng
        this.svg.style.width = "100%";
        this.svg.style.height = `${this.height}px`;
        this.svg.style.display = "block"; // tránh inline svg gây width bất thường
        this.svg.style.background = this.config.colors.background;

        // Quan sát kích thước container để re-render
        this.resizeObserver = new ResizeObserver(() => {
        this.safeRender();
        });
        this.resizeObserver.observe(this.svg);
    }
    el(tag, attrs = {}) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (v === null || v === undefined) continue;
            const val = typeof v === 'number' ? (Number.isFinite(v) ? String(v) : null) : String(v);
            if (val !== null) node.setAttribute(k, val);
        }
        return node;
    }
    getActualWidth() {
        // Ưu tiên boundingClientRect; nếu 0, thử clientWidth
        const w = this.svg.getBoundingClientRect().width || this.svg.clientWidth || 0;
        return Math.max(0, Math.floor(w));
    }
    scaleX(i, monthGap) {
        return this.config.sizes.marginLeft + i * monthGap;
    }
    scaleY(val, maxVal) {
        const innerHeight = this.height - this.config.sizes.marginTop - this.config.sizes.marginBottom;
        if (maxVal <= 0) {
            // fallback: vẽ tất cả ở baseline
            return this.config.sizes.marginTop + innerHeight;
        }
        return this.config.sizes.marginTop + innerHeight - (val / maxVal) * innerHeight;
    }
    // Render an toàn: nếu width=0 thì chờ đến khi có width > 0
    safeRender(maxWaitMs = 1000) {
        const start = performance.now();
        const tick = () => {
            const w = this.getActualWidth();
            if (w > 0) {
                this.render();
                return;
            }
            if (performance.now() - start >= maxWaitMs) {
                // fallback: đặt width giả định để không trắng trang
                this.svg.style.minWidth = "320px";
                this.render();
                return;
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    render() {
        const actualWidth = this.getActualWidth();
        if (!actualWidth) return; // bảo vệ lần gọi sớm

        this.svg.innerHTML = ""; // xoá chart cũ

        let maxVal = Math.max(...this.inList, this.targetValue);
        if (maxVal <= 0) {
            maxVal = 1; // tránh chia cho 0
        }

        const innerHeight = this.height - this.config.sizes.marginTop - this.config.sizes.marginBottom;

        // khoảng cách động theo width thực tế
        const monthGap = (actualWidth - this.config.sizes.marginLeft - this.config.sizes.marginRight) / this.timeList.length;
        const barWidth = 15; // giữ bar cố định

        // Vẽ bar (income dưới, expense trên)
        this.timeList.forEach((m,i)=>{
        const xBase = this.scaleX(i, monthGap);
        const yIncome = this.scaleY(this.inList[i], maxVal);

        // Income bar (click to toggle its value label)
        const incomeRect = this.el('rect',{
            x:xBase,
            y:yIncome,
            width:barWidth,
            height:this.config.sizes.marginTop+innerHeight-yIncome,
            fill:this.config.colors.income,
            rx:this.config.sizes.barRadius,
            ry:this.config.sizes.barRadius,
            style: 'cursor: pointer;'
        });
        this.svg.appendChild(incomeRect);

        // Income value label (hidden until click)
        const incomeLabelY = Math.max(this.config.sizes.marginTop, yIncome);
        const incomeLabel = this.el('text',{
            x: xBase + barWidth/2,
            y: incomeLabelY - 4,
            fill: this.config.colors.label,
            'text-anchor': 'middle',
            visibility: 'hidden'
        });
        incomeLabel.textContent = Number(this.inList[i]).toLocaleString();
        if (this.inList[i] != 0) {
            this.svg.appendChild(incomeLabel);
        }

        incomeRect.addEventListener('click', () => {
            const v = incomeLabel.getAttribute('visibility') || 'hidden';
            incomeLabel.setAttribute('visibility', v === 'visible' ? 'hidden' : 'visible');
        });

        // hover effect for income
        const incomeOrigFill = incomeRect.getAttribute('fill') || this.config.colors.income;
        const hoverColor = (this.config.colors && this.config.colors.hover) ? this.config.colors.hover : 'gray';
        incomeRect.addEventListener('mouseover', () => {
            incomeRect.setAttribute('fill', hoverColor);
        });
        incomeRect.addEventListener('mouseout', () => {
            incomeRect.setAttribute('fill', incomeOrigFill);
        });

        const label = this.el('text',{
            x:xBase + barWidth/2,
            y:this.config.sizes.marginTop+innerHeight+20,
            fill:this.config.colors.label,
            'text-anchor':'middle'
        });
        label.textContent = m;
        this.svg.appendChild(label);
        });

        // Line Target
        const difference = this.inList.map(val => this.targetValue);
        const pathD = difference.map((d,i)=>{
            const x = this.scaleX(i, monthGap)+barWidth/2;
            const y = this.scaleY(d, maxVal);
            return `${i===0?'M':'L'} ${x} ${y}`;
        }).join(' ');
        this.svg.appendChild(this.el('path',{
            d:pathD,
            stroke:this.config.colors.label,
            'stroke-width':1,
            fill:'none',
            'stroke-dasharray': '4 2'
        }));
    }
}
ChartUI = {
    //#region KcalChart
    renderChartKcal() {
        // Input Week
        if (!El.Chart.KcalInputWeek.value) {
            const thisWeekStr = Helper.dateToStringWeek(new Date());
            El.Chart.KcalInputWeek.value = thisWeekStr;
        }

        // List Days of Week
        const listDays = Helper.getDaysOfWeek(El.Chart.KcalInputWeek.value);
        const listWeekday = ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Intake and Burn List 
        const intakeList = [];
        const burnList = [];
        listDays.forEach(day => {
            const macro = dataTemp.getNutritionMacroByDate(day);
            intakeList.push(Math.round(macro.kcal));

            const burn = dataTemp.getTotalKcalWorkoutByDate(day);
            burnList.push(Math.round(burn));
        });

        // Config
        const config = {
            colors:{
                income:"rgb(188, 221, 213)",
                expense:"rgb(230, 206, 206)",
                difference:"rgb(37, 37, 37)",
                label:"rgb(37, 37, 37)",
                background: "rgb(233, 233, 233)",
                hover: "rgb(175, 175, 175)"
            },
            sizes:{
                svgHeight:300,
                barRadius:4,
                pointRadius:4,
                marginTop:20,
                marginRight:10,
                marginBottom:80,
                marginLeft:30
            },
            spacing:{monthGap:50}
        };

        // Chart InOut
        El.Chart.TargetKcal.innerHTML = dataTemp.getMacroTarget(new Date()).kcal.toFixed(0);
        const kcalChart = new InOutChart(El.Chart.KcalChart, intakeList, burnList, listWeekday, config);
        kcalChart.render();
    },

    //#region WeightChart
    renderChartWeight() {
        // Input Year
        if (!El.Chart.WeightInputYear.value) {
            const today = new Date();
            const thisYear = parseInt(today.getFullYear());
            El.Chart.WeightInputYear.value = thisYear;
        }
        const viewYear = parseInt(El.Chart.WeightInputYear.value);

        // List Month and List Weight
        const weightList = []
        const listMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        listMonth.forEach(monthStr => {
            const yearMonthStr = `${viewYear}-${monthStr}`;
            const averageWeight = dataTemp.getAverageWeightByMonth(yearMonthStr);
            weightList.push(averageWeight);
        });

        // Config
        const config = {
            colors:{
                income:"rgba(197, 197, 197, 1)",
                label:"rgb(37, 37, 37)",
                background: "rgb(233, 233, 233)",
                hover: "rgb(175, 175, 175)"
            },
            sizes:{
                svgHeight:300,
                barRadius:4,
                pointRadius:4,
                marginTop:20,
                marginRight:10,
                marginBottom:80,
                marginLeft:30
            },
            spacing:{monthGap:100}
        };

        //  Chart Weight
        El.Chart.TargerWeight.textContent = dataTemp.human.targetWeight;
        const weightChart = new BarChart(El.Chart.WeightChart, weightList, dataTemp.human.targetWeight, listMonth, config);
        weightChart.render();

    },

    //#region Listen
    listen() {
        // Change Input Kcal Week
        El.Chart.KcalInputWeek.addEventListener('change', (e) => {
            this.renderChartKcal();
        });

        // Change Input Weight Year
        El.Chart.WeightInputYear.addEventListener('change', (e) => {
            this.renderChartWeight();
        });

        // Redraw Chart
        window.addEventListener('resize', () => {
            this.renderChartKcal();
            this.renderChartWeight();
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    ChartUI.renderChartKcal();
    ChartUI.renderChartWeight();
    ChartUI.listen();


})
