const WorkoutUI = {

    //#region Status
    renderStatus() {
        El.Workout.Status.innerHTML = '';

        // Input Workout Date
        if (!El.Workout.InputDate.value) {
            El.Workout.InputDate.value = Helper.dateToString(new Date());
        }

        // Get Detail Data By Date and Target
        const totalKcalWorkoutDate = dataTemp.getTotalKcalWorkoutByDate(El.Workout.InputDate.value);  
        const kcalWorkoutTarget = dataTemp.human.kcalWorkoutTarget;

        // Calc
        const percent = parseInt(totalKcalWorkoutDate *100 / kcalWorkoutTarget)

        // Div Row Macro
        const elDivRow = document.createElement('div');
        elDivRow.className = 'flex-row';

        // Label
        const elLabel = UI.Label("KcalBurn", `${totalKcalWorkoutDate.toFixed(0)}/${kcalWorkoutTarget}`)
        elDivRow.appendChild(elLabel);

        // Finish
        const elProgess = UI.ProgressBar(`progress-kcal`, null, percent)
        elDivRow.appendChild(elProgess);

        // Append
        El.Workout.Status.appendChild(elDivRow);
    },

    //#region List
    renderList() {
        El.Workout.List.innerHTML = '';

        // Workout List By Date
        const viewdate = El.Workout.InputDate.value;
        const workoutsFilter = dataTemp.workouts.getWorkoutsByDate(viewdate)

        // Render Workout List
        workoutsFilter.forEach(workout => {

            // Add To List
            const elDivItem = this.createWorkoutItem(workout);
            El.Workout.List.appendChild(elDivItem);
        });
    },

    //#region WorkoutItem
    createWorkoutItem(workout) {
        // Data of Workout
        const workoutInfo = dataTemp.getWorkoutInfo(workout.exerciseId, workout.duration);

        // Div Item
        const elDiv = document.createElement('div');
        elDiv.className = 'flex-col underline';

        // Div Header
        const elHeader = document.createElement('div');
        elHeader.className = 'flex-row';

        // Button Edit
        const elButtonEdit = document.createElement('button');
        elButtonEdit.className = 'button-icon';
        elButtonEdit.textContent = '≡';
        elHeader.appendChild(elButtonEdit);

        // Name
        const elName = document.createElement('p');
        elName.className = 'label';
        elName.textContent = `${workoutInfo.excerciseName} (${workout.duration}min)`;
        elHeader.appendChild(elName);

        // Kcal
        const elKcal = document.createElement('p');
        elKcal.textContent = `${workoutInfo.kcalBurn.toFixed(0)} kcal`;
        elHeader.appendChild(elKcal);

        // Append Header
        elDiv.appendChild(elHeader);

        // Detail Set
        if (workout.sets.length > 0) {
            // Div
            const elDivSet = document.createElement('div');
            elDivSet.className = 'flex-row';

            // List Set
            let sumKg = 0
            workout.sets.forEach(set => {
                const elSet = document.createElement('p');
                elSet.className = 'number';
                elSet.textContent = `${set.reps}x${set.volume}`;
                elDivSet.appendChild(elSet);
                sumKg += set.reps * set.volume;
            });

            // Total
            const elTotal = document.createElement('p');
            elTotal.className = 'number';
            elTotal.textContent = `= ${sumKg}kg`;
            elDivSet.appendChild(elTotal);

            // Append
            elDiv.appendChild(elDivSet)
        }

        // Click Edit Button
        elButtonEdit.addEventListener('click', () => {
            this.showModal(workout);
        })

        return elDiv;
    },

    //#region Modal
    showModal(workout) {
        El.Workout.Modal.style.display = 'block';

        // Search Exercises
        El.Workout.ModalSearchExercises.value = '';
        El.Workout.InputExerciseSearch.innerHTML = '';

        // Select Exercise Category
        this.renderSelectCategory();

        if(workout) {
            // Workout Id Hidden
            El.Workout.InputId.value = workout.id;

            // Select Category
            const categoryId = dataTemp.getCategoryIdByWorkout(workout);
            El.Workout.InputCategory.value = categoryId;

            // Select Exercise
            this.renderSelectExercise(categoryId);
            El.Workout.InputExercise.value = workout.exerciseId;

            // Workout Duration
            El.Workout.InputDuration.value = workout.duration;

            // Set
            this.renderSetsList(workout.sets);

            // Button
            El.Workout.ModalAction.style.display = 'none';
            El.Workout.ModalDelete.style.display = 'block';
            El.Workout.ModalUpdate.style.display = 'block';

        } else {
            // Workout Id Default
            El.Workout.InputId.value = 'id';

            // Select Category Unknown
           El.Workout.InputCategory.value = 'id';

            // Select Exercise Unknown
            this.renderSelectExercise('id');
            El.Workout.InputExercise.value = 'id';

            // Workout Duration
            El.Workout.InputDuration.value = 30;

            // Set
            this.renderSetsList([]);

            // Button
            El.Workout.ModalAction.style.display = 'block';
            El.Workout.ModalDelete.style.display = 'none';
            El.Workout.ModalUpdate.style.display = 'none';
        }
    },

    //#region Category
    renderSelectCategory() {
        El.Workout.InputCategory.innerHTML = '';

        // Category List
        const categoryList = dataTemp.exercises.categories;
        categoryList.forEach(category => {
            const elOption = document.createElement('option');
            elOption.value = category.id;
            elOption.textContent = category.name;
            El.Workout.InputCategory.appendChild(elOption);
        })
    },

    //#region Exercise
    renderSelectExercise(categoryId) {
        El.Workout.InputExercise.innerHTML = '';

        // Exercises Filter List By Category
        const exercisesFilter = dataTemp.exercises.getExercisesByCategoryId(categoryId);
        exercisesFilter.forEach(exercise => {
            const elOption = document.createElement('option');
            elOption.value = exercise.id;
            elOption.textContent = exercise.name;
            El.Workout.InputExercise.appendChild(elOption);
        });
    },

    //#region SetsList
    renderSetsList(workoutSets) {
        El.Workout.SetsList.innerHTML = '';

        if (workoutSets.length === 0) return;

        // List of Set
        workoutSets.forEach((set, idx )=> {
            const elDivSet = this.renderSetItem(set, idx);

            // Append
            El.Workout.SetsList.appendChild(elDivSet);
        });
    },

    //#region SetItem
    renderSetItem(set, idx) {
        const elDivSet = document.createElement('div');
        elDivSet.className = 'flex-row';

        // Delete Button
        const elButtonDelete = document.createElement('button');
        elButtonDelete.className = 'button-icon';
        elButtonDelete.textContent = 't';
        elDivSet.appendChild(elButtonDelete);

        // Reps
        const elInputReps = document.createElement('input');
        elInputReps.className = 'modal-input';
        elInputReps.type = 'number';
        elInputReps.value = set.reps;
        elDivSet.appendChild(elInputReps);

        // Label
        const elLabel = document.createElement('p');
        elLabel.textContent = `x`;
        elDivSet.appendChild(elLabel);

        // Volume
        const elInputVolume = document.createElement('input');
        elInputVolume.className = 'modal-input';
        elInputVolume.type = 'number';
        elInputVolume.value = set.volume;
        elDivSet.appendChild(elInputVolume);

        // Unit
        const elUnit = document.createElement('p');
        elUnit.textContent = `kg`;
        elDivSet.appendChild(elUnit);



        // Click Delete
        elButtonDelete.addEventListener('click', () => {
            elDivSet.innerHTML = '';
        });

        return elDivSet;
    },

    //#region Listen
    listen() {
        // Input Date
        El.Workout.InputDate.addEventListener('change', () => {
            this.renderStatus();
            this.renderList();
        });
        
        // Add Workout
        El.Workout.ButtonAdd.addEventListener('click', () => {
            this.showModal(null);
        });

        // Select Category
        El.Workout.InputCategory.addEventListener('change', (e) => {
            this.renderSelectExercise(e.target.value);
        });

        // Click Action Button
        El.Workout.ModalAction.addEventListener('click', () => {
            const exerciseId = El.Workout.InputExercise.value;
            const duration = El.Workout.InputDuration.value;

            // Workout Set
            const workoutSet = []
            const elDivSetList = El.Workout.SetsList.getElementsByTagName('div');
            Array.from(elDivSetList).forEach(elDivSet => {
                const elInputList = elDivSet.getElementsByTagName('input');
                const repsValue = elInputList[0].value;
                const volumeValue = elInputList[1].value;
                const set = {reps: repsValue, volume: volumeValue}
                workoutSet.push(set);
            });

            const newWorkout = new Workout(Helper.UUID(), exerciseId, duration, new Date(), workoutSet);
            dataTemp.workouts.addWorkout(newWorkout)
            dataTemp.save();
            this.renderList();
            this.renderStatus();
            MealUI.renderStatus();

            El.Workout.Modal.style.display = 'none';
        });

        // Click Update Button
        El.Workout.ModalUpdate.addEventListener('click', () => {
            const workoutId = El.Workout.InputId.value;
            const exerciseId = El.Workout.InputExercise.value;
            const duration = El.Workout.InputDuration.value;

            // Workout Set
            const workoutSet = []
            const elDivSetList = El.Workout.SetsList.getElementsByTagName('div');
            Array.from(elDivSetList).forEach(elDivSet => {
                const elInputList = elDivSet.getElementsByTagName('input');
                if (elInputList.length === 0) return;
                const repsValue = elInputList[0].value;
                const volumeValue = elInputList[1].value;
                const set = {reps: repsValue, volume: volumeValue}
                workoutSet.push(set);
            });

            dataTemp.workouts.updateWorkout(workoutId, exerciseId, duration, workoutSet)
            dataTemp.save();
            this.renderList();
            this.renderStatus();
            MealUI.renderStatus();

            El.Workout.Modal.style.display = 'none'
        });

        // Click Delete Button
        El.Workout.ModalDelete.addEventListener('click', () => {
            if (!confirm("Delete This Workout")) return;
            const workoutId = El.Workout.InputId.value;
            dataTemp.workouts.deleteWorkoutById(workoutId);
            dataTemp.save();
            this.renderList();
            this.renderStatus();
            MealUI.renderStatus();

            El.Workout.Modal.style.display = 'none';
        });

        // Click Cancel Button
        El.Workout.ModalCancel.addEventListener('click', () => {
            El.Workout.Modal.style.display = 'none'
        });

        // Modal Search Foods
        El.Workout.ModalSearchExercises.addEventListener('change', (e) => {
            const exerciseFindList = dataTemp.exercises.getExerciseByName(e.target.value);
            El.Workout.InputExerciseSearch.innerHTML = '';
            exerciseFindList.forEach(exercise => {
                const elOption = document.createElement('option');
                elOption.value = exercise.id;
                elOption.textContent = exercise.name;
                El.Workout.InputExerciseSearch.appendChild(elOption);
            });

            const exerciseFind = exerciseFindList[0] || null;

            if (!exerciseFind) return;
            El.Workout.InputCategory.value = exerciseFind.categoryId;
            this.renderSelectExercise(exerciseFind.categoryId);
            El.Workout.InputExercise.value = exerciseFind.id;
            
            El.Workout.ModalSearchExercises.value = '';
        })

        // Modal Result Exercise
        El.Workout.InputExerciseSearch.addEventListener('change', (e) => {
            const exerciseId = e.target.value;
            const exerciseFind = dataTemp.exercises.getExerciseById(exerciseId);
            El.Workout.InputCategory.value = exerciseFind.categoryId;
            this.renderSelectExercise(exerciseFind.categoryId);
            El.Workout.InputExercise.value = exerciseFind.id;
        });

        // Modal Workout Add Set
        El.Workout.ButtonAddSet.addEventListener('click', () => {
            const newSet = {reps: 1, volume: 1};
            const idx = El.Workout.SetsList.getElementsByTagName('div').length;
            const elDivSet = this.renderSetItem(newSet, idx);
            El.Workout.SetsList.appendChild(elDivSet);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    WorkoutUI.renderStatus();
    WorkoutUI.renderList();
    WorkoutUI.listen();
})