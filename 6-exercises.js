const ExerciseUI = {

    //#region ExercisesList
    renderList() {
        El.Exercise.List.innerHTML = '';

        // Category List
        const categoriesList = dataTemp.exercises.sortCategoriesByName();

        // Render Category List
        categoriesList.forEach(category => {

            // Div Category
            const elDivCategory = this.createCategoryItem(category);
            El.Exercise.List.appendChild(elDivCategory);
        });
    },

    //#region CategoryItem
    createCategoryItem(category) {
        // Calc
        const listExercises = dataTemp.exercises.getExercisesByCategoryId(category.id);
        const numberOfExercises = category.id === "id" ? listExercises.length - 1 : listExercises.length;

        // Div Category
        const elDiv = document.createElement('div');
        elDiv.className = 'flex-col';

        // Category Header
        const elDivCategoryHeader = document.createElement('div');
        elDivCategoryHeader.className = 'flex-row solid-light';

        // Button Show
        const elButtonShow = document.createElement('button');
        elButtonShow.className = 'button-icon';
        elButtonShow.textContent = ':'
        elDivCategoryHeader.appendChild(elButtonShow);

        // Category Name
        const elName = document.createElement('p');
        elName.className = 'label';
        elName.textContent = category.name;
        elDivCategoryHeader.appendChild(elName);

        // Number of Exercises
        const elNumber = document.createElement('p');
        elNumber.textContent = `${numberOfExercises} Exercises`;
        elDivCategoryHeader.appendChild(elNumber);

        // Append Category Header 
        elDiv.appendChild(elDivCategoryHeader);

        // Div Exercises List
        const elExercisesList = document.createElement('div');
        elExercisesList.style.display = 'none';
        elExercisesList.className = 'flex-col';

        // Render Foods List
        const sortListExercisesByKcal = dataTemp.exercises.sortExercisesByKcal(listExercises);
        sortListExercisesByKcal.forEach(exercise => {
            if (exercise.id === 'id') return;
            const elDivExercise = this.createExerciseItem(exercise);
            elExercisesList.appendChild(elDivExercise);

        })
        
        // Add To List
        elDiv.appendChild(elExercisesList)
        El.Exercise.List.appendChild(elDiv);

        // Click To Open or Close Category
        elButtonShow.addEventListener('click', () => {
            if (elExercisesList.style.display === 'none') {
                elExercisesList.style.display = 'block';
                elButtonShow.textContent = ';';
            } else {
                elExercisesList.style.display = 'none';
                elButtonShow.textContent = ':';
            }
        })

        return elDiv;
    },

    //#region ExerciseItem
    createExerciseItem(exercise) {
        // Div Exercise
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

        // Exercise Name
        const elName = document.createElement('p');
        elName.className = 'label';
        elName.textContent = `${exercise.name}`;
        elHeader.appendChild(elName);

        // Exercise KcalPerHour
        const elKcal = document.createElement('p');
        elKcal.textContent = `${exercise.kcalPerHour} kcal/h`;
        elHeader.appendChild(elKcal);

        // Add Header
        elDiv.appendChild(elHeader);

        // Add To Workout
        elButtonAdd.addEventListener('click', () => {
            const newWorkout = new Workout(Helper.UUID(), exercise.id, 30, new Date());
            dataTemp.workouts.addWorkout(newWorkout)
            dataTemp.save();
            WorkoutUI.renderList();
            WorkoutUI.renderStatus();
            MealUI.renderStatus();

        });

        // Edit Exercise
        elButtonEdit.addEventListener('click', () => {
            this.showModal(exercise);
        });

        return elDiv;
    },

    //#region ExerciseModal
    showModal(exercise) {
        El.Exercise.Modal.style.display = 'block';

        // Input Category
        El.Exercise.InputCategory.innerHTML = '';
        const categoriesList = dataTemp.exercises.sortCategoriesByName();
        categoriesList.forEach(cateogry => {
            const elOption = document.createElement('option');
            elOption.value = cateogry.id;
            elOption.textContent = cateogry.name;
            El.Exercise.InputCategory.appendChild(elOption);
        })

        if (exercise) {
            El.Exercise.InputId.value = exercise.id;
            El.Exercise.InputCategory.value = exercise.categoryId;
            El.Exercise.InputName.value = exercise.name;
            El.Exercise.InputKcalPerHour.value = exercise.kcalPerHour;

            // Button
            El.Exercise.ModalAdd.style.display = 'none';
            El.Exercise.ModalDelete.style.display = 'block';
            El.Exercise.ModalUpdate.style.display = 'block';
        } else {
            El.Exercise.InputId.value = "";
            El.Exercise.InputCategory.value = "";
            El.Exercise.InputName.value = "";
            El.Exercise.InputKcalPerHour.value = 30;
            
            // Button
            El.Exercise.ModalAdd.style.display = 'block';
            El.Exercise.ModalDelete.style.display = 'none';
            El.Exercise.ModalUpdate.style.display = 'none';
        }
    },

    //#region CategoryModal
    showModalCategory() {
        El.Exercise.CategoryModal.style.display = "block";

        El.Exercise.CategoryModalList.innerHTML = '';
        const categoriesList = dataTemp.exercises.sortCategoriesByName();
        categoriesList.forEach(category => {
            if (category.id === 'id') return;

            const elDivRow = document.createElement('div');
            elDivRow.className = 'flex-row';

            // Input Category Name
            const elInputName = document.createElement('input');
            elInputName.className = 'modal-input';
            elInputName.value = category.name;
            elDivRow.appendChild(elInputName);

            // Delete Category Button
            const elButtonDelete = document.createElement('button');
            elButtonDelete.className = 'button-icon';
            elButtonDelete.textContent = 't';
            elDivRow.appendChild(elButtonDelete);

            // Add to Categories List
            El.Exercise.CategoryModalList.appendChild(elDivRow);

            // Change Input Name
            elInputName.addEventListener('change', (e) => {
                category.name = e.target.value;
            })

            // Delete Category
            elButtonDelete.addEventListener('click', () => {
                dataTemp.exercises.deleteCategoryById(category.id);
                dataTemp.save()
                this.showModalCategory();
            })
        });
    },

    //#region ExerciseListen
    listen() {
        
        // Add Exercise
        El.Exercise.ButtonAdd.addEventListener('click', () => {
            this.showModal(null);
        });

        // Open Category Modal
        El.Exercise.ButtonCategory.addEventListener('click', () => {
            this.showModalCategory();
        });

        // Add Category
        El.Exercise.CategoryModalAdd.addEventListener('click', () => {
            const categoryName = El.Exercise.CategoryInputName.value.trim();
            if (categoryName === "") return;
            El.Exercise.CategoryInputName.value = "";

            const newCategory = new ExerciseCategory(Helper.UUID(), categoryName);
            dataTemp.exercises.addCategory(newCategory);
            dataTemp.save();
            this.showModalCategory();
        })

        // Close Category Modal
        El.Exercise.CategoryModalClose.addEventListener('click', () => {
            El.Exercise.CategoryModal.style.display = 'none';
            this.renderList();
        })

        // Click Add Button
        El.Exercise.ModalAdd.addEventListener('click', () => {
            const id = Helper.UUID();
            const name = El.Exercise.InputName.value;
            const categoryId = El.Exercise.InputCategory.value;
            const kcalPerHour = El.Exercise.InputKcalPerHour.value;

            const newExercise = new Exercise(id, categoryId, name, kcalPerHour);
            dataTemp.exercises.addExercise(newExercise)
            dataTemp.save();
            this.renderList();
            El.Exercise.Modal.style.display = 'none';
        });

        // Click Update Button
        El.Exercise.ModalUpdate.addEventListener('click', () => {
            const id = El.Exercise.InputId.value;
            const name = El.Exercise.InputName.value;
            const categoryId = El.Exercise.InputCategory.value;
            const kcalPerHour = El.Exercise.InputKcalPerHour.value;
            const exercise = dataTemp.exercises.getExerciseById(id);
            exercise.name = name;
            exercise.categoryId = categoryId;
            exercise.kcalPerHour = kcalPerHour;
            dataTemp.save();
            this.renderList();
            WorkoutUI.renderList();
            WorkoutUI.renderStatus();
            MealUI.renderStatus();

            El.Exercise.Modal.style.display = 'none'
        });

        // Click Delete Button
        El.Exercise.ModalDelete.addEventListener('click', () => {
            if (!confirm("Delete This Exercise")) return;
            const id = El.Exercise.InputId.value;
            dataTemp.exercises.deleteExerciseById(id);
            dataTemp.save();
            this.renderList();
            WorkoutUI.renderList();
            WorkoutUI.renderStatus();
            MealUI.renderStatus();

            El.Exercise.Modal.style.display = 'none'
        });

        // Click Cancel Button
        El.Exercise.ModalCancel.addEventListener('click', () => {
            El.Exercise.Modal.style.display = 'none'
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    ExerciseUI.renderList();
    ExerciseUI.listen();
})

