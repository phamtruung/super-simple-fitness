const FoodUI = {

    //#region FoodList
    renderList() {
        El.Food.List.innerHTML = '';

        // Number of Foods
        El.Food.NumberFoods.textContent = dataTemp.foods.list.length;

        // Category List
        const categoriesList = dataTemp.foods.sortCategoriesByName();

        // Render Category List
        categoriesList.forEach(category => {

            // Div Category
            const elDivCategory = this.createCategoryItem(category);
            El.Food.List.appendChild(elDivCategory);
        });
    },

    //#region CategoryItem
    createCategoryItem(category) {
        // Calc
        const listFood = dataTemp.foods.getFoodsByCategoryId(category.id);
        const numberOfFood = category.id === "id" ? listFood.length - 1 : listFood.length;

        // Div Category
        const elDiv = document.createElement('div');
        elDiv.className = 'flex-col';

        // Category Header
        const elDivCategoryHeader = document.createElement('div');
        elDivCategoryHeader.className = 'flex-row solid-light';

        // Button Show
        const elButtonShow = document.createElement('button');
        elButtonShow.className = 'button-icon';
        elButtonShow.textContent = ';'
        elDivCategoryHeader.appendChild(elButtonShow);

        // Category Name
        const elName = document.createElement('p');
        elName.className = 'label';
        elName.textContent = category.name;
        elDivCategoryHeader.appendChild(elName);

        // Number of Food
        const elNumber = document.createElement('p');
        elNumber.textContent = `${numberOfFood} Foods`;
        elDivCategoryHeader.appendChild(elNumber);

        // Append Category Header 
        elDiv.appendChild(elDivCategoryHeader);

        // Div Food List
        const elFoodsList = document.createElement('div');
        elFoodsList.style.display = 'block';
        elFoodsList.className = 'flex-col';

        // Render Foods List
        const sortListFoodByKcal = dataTemp.foods.sortFoodsByKcal(listFood);
        sortListFoodByKcal.forEach(food => {
            if (food.id === 'id') return;
            const elDivFood = this.createFoodItem(food);
            elFoodsList.appendChild(elDivFood);

        })
        
        // Add To List
        elDiv.appendChild(elFoodsList)
        El.Food.List.appendChild(elDiv);

        // Click To Open or Close Category
        elButtonShow.addEventListener('click', () => {
            if (elFoodsList.style.display === 'none') {
                elFoodsList.style.display = 'block';
                elButtonShow.textContent = ';';
            } else {
                elFoodsList.style.display = 'none';
                elButtonShow.textContent = ':';
            }
        })

        return elDiv;
    },

    //#region FoodItem
    createFoodItem(food) {
        // Div Food
        const elDiv = document.createElement('div');
        elDiv.className = 'flex-col underline';

        // Div Header
        const elHeader = document.createElement('div');
        elHeader.className = 'flex-row';

        // Add Button
        const elButtonAdd = document.createElement('button');
        elButtonAdd.className = 'button-icon';
        elButtonAdd.textContent = '*';
        elHeader.appendChild(elButtonAdd);

        // Edit Button
        const elButtonEdit = document.createElement('button');
        elButtonEdit.className = 'button-icon';
        elButtonEdit.textContent = 'H';
        elHeader.appendChild(elButtonEdit);

        // Food Name Amount Unit
        const elName = document.createElement('p');
        elName.className = 'label';
        elName.textContent = `${food.name}`;
        elHeader.appendChild(elName);

        // Food Kcal
        const elKcal = document.createElement('p');
        elKcal.textContent = `${food.kcal.toFixed(0)} kcal`;
        elHeader.appendChild(elKcal);

        // Add Header
        elDiv.appendChild(elHeader);

        // Div Detail
        const elDetail = document.createElement('div');
        elDetail.className = 'flex-row';

        // Div Ratior
        const elRatioBar = UI.RatioBarMacro(food.protein, food.carb, food.fat)
        elDetail.appendChild(elRatioBar);

        // Span
        const elSpan = document.createElement('p');
        elSpan.className = 'label';
        elDetail.appendChild(elSpan);

        // Add Detail
        elDiv.appendChild(elDetail);

        // Add To Meal
        elButtonAdd.addEventListener('click', () => {
            const newMeal = new Meal(Helper.UUID(), food.id, 1, new Date());
            dataTemp.meals.addMeal(newMeal)
            dataTemp.save();
            MealUI.renderList();
            MealUI.renderStatus();
            ChartUI.renderChartKcal();
        });

        // Edit Food
        elButtonEdit.addEventListener('click', () => {
            this.showModal(food);
        });

        return elDiv;
    },

    //#region FoodModal
    showModal(food) {
        El.Food.Modal.style.display = 'block';

        // Input Category
        El.Food.InputCategory.innerHTML = '';
        const categoriesList = dataTemp.foods.sortCategoriesByName();
        categoriesList.forEach(cateogry => {
            const elOption = document.createElement('option');
            elOption.value = cateogry.id;
            elOption.textContent = cateogry.name;
            El.Food.InputCategory.appendChild(elOption);
        })

        if (food) {
            El.Food.InputId.value = food.id;
            El.Food.InputCategory.value = food.categoryId;
            El.Food.InputName.value = food.name;
            El.Food.InputAmount.value = food.amount;
            El.Food.InputUnit.value = food.unit;
            El.Food.InputProtein.value = food.protein;
            El.Food.InputCarb.value = food.carb;
            El.Food.InputFat.value = food.fat;
            El.Food.InputFiber.value = food.fiber;
            El.Food.ShowKcal.textContent = food.kcal;

            // Button
            El.Food.ModalAdd.style.display = 'none';
            El.Food.ModalDelete.style.display = 'block';
            El.Food.ModalUpdate.style.display = 'block';
        } else {
            El.Food.InputId.value = "";
            El.Food.InputCategory.value = "";
            El.Food.InputName.value = "";
            El.Food.InputAmount.value = 1;
            El.Food.InputUnit.value = "";
            El.Food.InputProtein.value = 0;
            El.Food.InputCarb.value = 0;
            El.Food.InputFat.value = 0;
            El.Food.InputFiber.value = 0;
            El.Food.ShowKcal.textContent = 0;
            
            // Button
            El.Food.ModalAdd.style.display = 'block';
            El.Food.ModalDelete.style.display = 'none';
            El.Food.ModalUpdate.style.display = 'none';
        }
    },

    //#region CategoryModal
    showModalCategory() {
        El.Food.CategoryModal.style.display = "block";

        El.Food.CategoryModalList.innerHTML = '';
        const categoriesList = dataTemp.foods.sortCategoriesByName();
        categoriesList.forEach(category => {
            if (category.id === 'id') return;

            const elDivRow = document.createElement('div');
            elDivRow.className = 'flex-row';

            // Input Category Name
            const elInputName = document.createElement('input');
            elInputName.className = 'modal-input-max';
            elInputName.value = category.name;
            elDivRow.appendChild(elInputName);

            // Delete Category Button
            const elButtonDelete = document.createElement('button');
            elButtonDelete.className = 'button-icon'
            elButtonDelete.textContent = 't';
            elDivRow.appendChild(elButtonDelete);

            // Add to Categories List
            El.Food.CategoryModalList.appendChild(elDivRow);

            // Change Input Name
            elInputName.addEventListener('change', (e) => {
                category.name = e.target.value;
                dataTemp.save();
            })

            // Delete Category
            elButtonDelete.addEventListener('click', () => {
                dataTemp.foods.deleteCategoryById(category.id);
                dataTemp.save()
                this.showModalCategory();
            })
        });
    },

    //#region FoodListen
    listen() {
        
        // Add Food
        El.Food.ButtonAdd.addEventListener('click', () => {
            this.showModal(null);
        });

        // Open Category Modal
        El.Food.ButtonCategory.addEventListener('click', () => {
            this.showModalCategory();
        });

        // Add Category
        El.Food.CategoryModalAdd.addEventListener('click', () => {
            const categoryName = El.Food.CategoryInputName.value.trim();
            if (categoryName === "") return;
            El.Food.CategoryInputName.value = "";

            const newCategory = new FoodCategory(Helper.UUID(), categoryName);
            dataTemp.foods.addCategory(newCategory);
            dataTemp.save();
            this.showModalCategory();
        })

        // Close Category Modal
        El.Food.CategoryModalClose.addEventListener('click', () => {
            El.Food.CategoryModal.style.display = 'none';
            this.renderList();
        })

        // Change Input Macro
        const listInputMacro = [
            El.Food.InputProtein,
            El.Food.InputCarb,
            El.Food.InputFat,
        ]
        listInputMacro.forEach(el => {
            el.addEventListener('change', () => {
                const protein = El.Food.InputProtein.value;
                const carb = El.Food.InputCarb.value;
                const fat = El.Food.InputFat.value;
                const kcal = protein * 4 + carb * 4 + fat * 9;

                El.Food.ShowKcal.textContent = kcal;
            })
        })

        // Click Add Button
        El.Food.ModalAdd.addEventListener('click', () => {
            const id = Helper.UUID();
            const name = El.Food.InputName.value;
            const categoryId = El.Food.InputCategory.value;
            const amount = El.Food.InputAmount.value;
            const unit = El.Food.InputUnit.value;
            const protein = El.Food.InputProtein.value;
            const carb = El.Food.InputCarb.value;
            const fat = El.Food.InputFat.value;
            const fiber = El.Food.InputFiber.value;

            const newFood = new Food(
                id, name, categoryId, amount, unit, 
                protein, carb, fat, fiber
            );
            dataTemp.foods.addFood(newFood)
            dataTemp.save();
            this.renderList();
            El.Food.Modal.style.display = 'none';
        });

        // Click Update Button
        El.Food.ModalUpdate.addEventListener('click', () => {
            const id = El.Food.InputId.value;
            const name = El.Food.InputName.value;
            const categoryId = El.Food.InputCategory.value;
            const amount = El.Food.InputAmount.value;
            const unit = El.Food.InputUnit.value;
            const protein = El.Food.InputProtein.value;
            const carb = El.Food.InputCarb.value;
            const fat = El.Food.InputFat.value;
            const fiber = El.Food.InputFiber.value;
            const food = dataTemp.foods.getFoodById(id);
            food.name = name;
            food.categoryId = categoryId;
            food.amount = amount;
            food.unit = unit;
            food.protein = protein;
            food.carb = carb;
            food.fat = fat;
            food.fiber = fiber;
            food.kcal = food.calcKcal();
            dataTemp.save();
            this.renderList();
            MealUI.renderList();
            MealUI.renderStatus();
            ChartUI.renderChartKcal();
            El.Food.Modal.style.display = 'none'
        });

        // Click Delete Button
        El.Food.ModalDelete.addEventListener('click', () => {
            if (!confirm("Delete This Food")) return;
            const id = El.Food.InputId.value;
            dataTemp.foods.deleteFoodById(id);
            dataTemp.save();
            this.renderList();
            MealUI.renderList();
            MealUI.renderStatus();
            El.Food.Modal.style.display = 'none'
        });

        // Click Cancel Button
        El.Food.ModalCancel.addEventListener('click', () => {
            El.Food.Modal.style.display = 'none'
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    FoodUI.renderList();
    FoodUI.listen();
})
