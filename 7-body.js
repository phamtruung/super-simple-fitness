const BodyUI = {
    
    //#region Status
    renderStatus() {
        El.Body.Status.innerHTML = '';

        const status = dataTemp.human.getStatus();

        Object.keys(status).forEach(key => {
            const elDivRow = UI.Label(key, status[key])
            El.Body.Status.appendChild(elDivRow);
        });
    },

    //#region Infor
    renderInfor() {
        El.Body.InputGender.value = dataTemp.human.gender;
        El.Body.InputBirth.value = dataTemp.human.yearBirth;
        El.Body.InputHeight.value = dataTemp.human.height;
        El.Body.InputWeight.value = dataTemp.human.weight;
        El.Body.InputTargetWeight.value = dataTemp.human.targetWeight;
        El.Body.InputTargetWorkout.value = dataTemp.human.kcalWorkoutTarget;
    },

    //#region SaveInfor
    saveInfor() {
        dataTemp.human.gender = El.Body.InputGender.value;
        dataTemp.human.yearBirth = El.Body.InputBirth.value;
        dataTemp.human.height = El.Body.InputHeight.value;
        dataTemp.human.weight = El.Body.InputWeight.value;
        dataTemp.human.targetWeight = El.Body.InputTargetWeight.value;
        dataTemp.human.kcalWorkoutTarget = El.Body.InputTargetWorkout.value;

        // Get List Weight
        const elWeightList = El.Body.WeightList.getElementsByTagName('div');
        const listOfWeight = [];
        Array.from(elWeightList).forEach(elWeight => {
            const inputList = elWeight.getElementsByTagName('p');
            if(inputList.length === 0) return;
            const dateStr = Helper.dateToString(inputList[0].textContent);
            const weightValue = parseFloat(inputList[1].textContent);
            const weightSet = {date: dateStr, weight: weightValue};
            listOfWeight.push(weightSet);
        });
        dataTemp.human.listOfWeight = listOfWeight;

        dataTemp.save();
    },

    //#region ListWeight
    renderListOfWeight() {
        El.Body.WeightList.innerHTML = '';

        if(dataTemp.human.listOfWeight.length === 0) return;

        dataTemp.human.listOfWeight.forEach(weightSet => {
            
            // Div Row
            const elDivRow = document.createElement('div');
            elDivRow.className = 'flex-row underline';

            // Date
            const elDate = document.createElement('p');
            elDate.className = 'label';
            elDate.textContent = weightSet.date;
            elDivRow.appendChild(elDate);

            // Weight
            const elWeight = document.createElement('p');
            elWeight.textContent = weightSet.weight;
            elDivRow.appendChild(elWeight);

            // Unit
            const elUnit = document.createElement('p');
            elUnit.textContent = 'kg';
            elDivRow.appendChild(elUnit);

            // Button Delete
            const elButtonDelete = document.createElement('button');
            elButtonDelete.className = 'button-icon';
            elButtonDelete.textContent = 't';
            elDivRow.appendChild(elButtonDelete);

            // Append
            El.Body.WeightList.appendChild(elDivRow);

            // Delete Weight
            elButtonDelete.addEventListener('click', () => {
                elDivRow.innerHTML = '';
                this.saveInfor();
                this.renderListOfWeight();
            })
        });
    },

    //#region Listen
    listen() {
        // Input Body Change
        const elInputList = El.Body.InforList.getElementsByClassName('modal-input');
        Array.from(elInputList).forEach(elInput => {
            elInput.addEventListener('change', (e) => {
                this.saveInfor();
                this.renderStatus();
                MealUI.renderStatus();
                WorkoutUI.renderStatus();

                // Change Weight Render List of Weight
                if(elInput.id === 'body-input-weight') {
                    const newWeight = {
                        date: Helper.dateToString(new Date()),
                        weight: parseFloat(e.target.value)
                    }
                    dataTemp.human.listOfWeight.push(newWeight);
                    dataTemp.save()
                    this.renderListOfWeight();
                }
            })
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    BodyUI.renderStatus();
    BodyUI.renderInfor();
    BodyUI.renderListOfWeight();
    BodyUI.listen();
})