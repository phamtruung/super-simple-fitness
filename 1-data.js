//#region FoodCategory
class FoodCategory {
    constructor(id='id', name='Unknown') {
        this.id = id;
        this.name = name;
    }
    static fromObj(obj) {
        return new FoodCategory(obj.id, obj.name);
    }
}

//#region Food
class Food {
    constructor(
        id='id',
        name='Unknown',
        categoryId='id',
        amount=0,
        unit='unit',
        protein=0,
        carb=0,
        fat=0,
        fiber=0
    ) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.amount = parseFloat(amount);
        this.unit = unit;
        this.protein = parseFloat(protein);
        this.carb = parseFloat(carb);
        this.fat = parseFloat(fat);
        this.fiber = parseFloat(fiber);
        this.kcal = this.calcKcal();
    }
    static fromObj(obj) {
        return new Food(obj.id, obj.name, obj.categoryId, obj.amount, obj.unit, 
            obj.protein, obj.carb, obj.fat, obj.fiber);
    }
    calcKcal() {
        return this.protein * 4 + this.carb * 4 + this.fat * 9;
    }
    macroPercent() {
        if (this.kcal === 0) {
            return { proteinPercent: 0, carbPercent: 0, fatPercent: 0 };
        }
        const proteinPercent = parseInt((this.protein * 4 / this.kcal) * 100);
        const carbPercent = parseInt((this.carb * 4 / this.kcal) * 100);
        const fatPercent = parseInt((this.fat * 9 / this.kcal) * 100);
        return { proteinPercent, carbPercent, fatPercent };
    }
}

//#region Meal
class Meal {
    constructor(id, foodId, amount, date) {
        this.id = id;
        this.foodId = foodId;
        this.amount = parseFloat(amount);
        this.date = Helper.dateToString(date);
    }
    static fromObj(obj) {
        return new Meal(obj.id, obj.foodId, obj.amount, obj.date);
    }
}

//#region Foods
class Foods {
    constructor() {
        this.categories = [];
        this.list = [];
    }
    addCategory(foodCategory) {
        if (foodCategory instanceof FoodCategory) {
            this.categories.push(foodCategory);
        } else {
            console.error("Not a Food Category", foodCategory);
        }
    }
    addFood(food) {
        if (food instanceof Food) {
            this.list.push(food);
        } else {
            console.error("Not a Food", food);
        }    
    }
    getCategoryById(categoryId) {
        return this.categories.find(category => category.id === categoryId) || null;
    }
    getFoodById(foodId) {
        return this.list.find(food => food.id === foodId) || null;
    }
    getFoodsByName(name) {
        return this.list.filter(food => food.name.toLowerCase().includes(name.toLowerCase()));
    }
    getFoodsByCategoryId(categoryId) {
        return this.list.filter(food => food.categoryId === categoryId);
    }
    deleteFoodById(foodId) {
        this.list = this.list.filter(food => food.id !== foodId);
    }
    deleteCategoryById(categoryId) {
        this.categories = this.categories.filter(category => category.id !== categoryId);
        this.list.forEach(food => {
            if (food.categoryId === categoryId) {
                food.categoryId = 'id';
            }
        });
    }
    sortCategoriesByName() {
        return this.categories.sort((a, b) => a.name.localeCompare(b.name));
    }
    sortFoodsByKcal(foodsList) {
        return foodsList.sort((a, b) => a.kcal - b.kcal);
    }
}

//#region Meals
class Meals {
    constructor() {
        this.list = [];
    }
    addMeal(meal) {
        if (meal instanceof Meal) {
            this.list.push(meal);
        } else {
            console.error("Not a Meal", meal);
        }
    }
    getMealById(mealId) {
        return this.list.find(meal => meal.id === mealId) || null;
    }
    getMealsByDate(date) {
        return this.list.filter(meal => Helper.dateToString(meal.date) === Helper.dateToString(date));
    }
    deleteMealById(mealId) {
        this.list = this.list.filter(meal => meal.id !== mealId);
    }
    updateMeal(id, foodId, amount) {
        const meal = this.getMealById(id);
        meal.foodId = foodId;
        meal.amount = parseFloat(amount);
    }
}

//#region ExerciseCategory
class ExerciseCategory {
    constructor(id = 'id', name = 'Unknown') {
        this.id = id;
        this.name = name;
    }
    static fromObj(obj) {
        return new ExerciseCategory(obj.id, obj.name);
    }
}

//#region Exercise
class Exercise {
    constructor(
        id='id', 
        categoryId='id', 
        name='Unknown', 
        kcalPerHour=0, 
    ) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.kcalPerHour = parseInt(kcalPerHour);
    }
    static fromObj(obj) {
        return new Exercise(obj.id, obj.categoryId, obj.name, obj.kcalPerHour);
    }
}

//#region Workout
class Workout {
    constructor(id, exerciseId, durationMinute, date, sets=[]) {
        this.id = id;
        this.exerciseId = exerciseId;
        this.duration = parseInt(durationMinute),
        this.date = Helper.dateToString(date);
        this.sets = sets
    }
    static fromObj(obj) {
        return new Workout(obj.id, obj.exerciseId, obj.duration, obj.date, obj.sets);
    }
}

//#region Exercises
class Exercises {
    constructor() {
        this.categories = [];
        this.list = [];
    }
    addCategory(exerciseCategory) {
        if (exerciseCategory instanceof ExerciseCategory) {
            this.categories.push(exerciseCategory);
        } else {
            console.error("Not a Exercise Category", exerciseCategory);
        }
    }
    addExercise(exercise) {
        if (exercise instanceof Exercise) {
            this.list.push(exercise);
        } else {
            console.error("Not a Exercise", exercise);
        }
    }
    getCategoryById(categoryId) {
        return this.categories.find(category => category.id === categoryId) || null;
    }
    getExerciseById(exerciseId) {
        return this.list.find(exercise => exercise.id === exerciseId) || null;
    }
    getExerciseByName(name) {
        return this.list.filter(exercise => exercise.name.toLowerCase().includes(name.toLowerCase()));
    }
    getExercisesByCategoryId(categoryId) {
        return this.list.filter(exercise => exercise.categoryId === categoryId);
    }
    deleteExerciseById(exerciseId) {
        this.list = this.list.filter(exercise => exercise.id !== exerciseId);
    }
    deleteCategoryById(categoryId) {
        this.categories = this.categories.filter(category => category.id !== categoryId);
        this.list.forEach(exercise => {
            if (exercise.categoryId === categoryId) {
                exercise.categoryId = 'id';
            }
        });
    }
    sortCategoriesByName() {
        return this.categories.sort((a, b) => a.name.localeCompare(b.name));
    }
    sortExercisesByKcal(exercisesList) {
        return exercisesList.sort((a, b) => a.kcalPerHour - b.kcalPerHour);
    }
}

//#region Workouts
class Workouts{
    constructor() {
        this.list = []
    }
    addWorkout(workout) {
        if (workout instanceof Workout) {
            this.list.push(workout);
        } else {
            console.error("Not a Workout", workout);
        }
    }
    getWorkoutById(workoutId) {
        return this.list.find(workout => workout.id === workoutId) || null;
    }
    getWorkoutsByDate(date) {
        return this.list.filter(workout => Helper.dateToString(workout.date) === Helper.dateToString(date));
    }
    deleteWorkoutById(workoutId) {
        this.list = this.list.filter(workout => workout.id !== workoutId);
    }
    updateWorkout(id, exerciseId, duration, workoutSets) {
        const workout = this.getWorkoutById(id);
        workout.exerciseId = exerciseId;
        workout.duration = parseInt(duration);
        workout.sets = workoutSets
    }
    getWokoutsByWeek(date) {
        return this.list.filter(workout => Helper.dateToStringWeek(workout.date) === Helper.dateToStringWeek(date));
    }
}

//#region Human
class Human {
    constructor(
        gender='male', 
        yearBirth = 1984, 
        heightCM = 168, 
        weight = 70, 
        targetWeight = 65, 
        kcalWorkoutTarget = 300, 
        listOfWeight = [{date: Helper.dateToString(new Date()), weight: 70}]
    ) {
        this.gender = gender;
        this.yearBirth = parseInt(yearBirth);
        this.height = parseFloat(heightCM);
        this.weight = parseFloat(weight);
        this.targetWeight = parseFloat(targetWeight);
        this.kcalWorkoutTarget = parseInt(kcalWorkoutTarget);
        this.listOfWeight = listOfWeight
        this.kcalChangePerDay = 300;
    }
    static fromObj(obj) {
        return new Human(obj.gender, obj.yearBirth, obj.height, obj.weight, 
            obj.targetWeight, obj.kcalWorkoutTarget, obj.listOfWeight, obj.kcalChangePerDay);
    }
    getAge() {
        const today = new Date();
        return today.getFullYear() - this.yearBirth;
    }
    getIdealWeight() {
        const heightM = this.height / 100;
        const minWeight = parseInt(18.5 * (heightM ** 2));
        const maxWeight = parseInt(24.9 * (heightM ** 2));
        const idealWeight = this.gender === 'male' ? maxWeight : minWeight;
        return idealWeight;
    }
    getMonthsToGetTargetWeight() {
        const diffWeight = this.targetWeight - this.weight;
        // Change 3kg per Month
        const targetMonths = Math.abs(diffWeight) / 3;
        return targetMonths;
    }
    getBMI() {
        return (this.weight / ((this.height / 100) ** 2));
    }
    getBMIConclusion() {
        const bmi = this.getBMI();
        const value = parseFloat(bmi);

        if (value < 18.5) {
            return "Underweight";
        } else if (value >= 18.5 && value < 24.9) {
            return "Normal";
        } else if (value >= 25 && value < 29.9) {
            return "Overweight";
        } else if (value >= 30 && value < 34.9) {
            return "Obesity I";
        } else if (value >= 35 && value < 39.9) {
            return "Obesity II";
        } else {
            return "Obesity III";
        }
    }
    getBMR() {
        const age = this.getAge();
        if (this.gender === "male") {
            return (10 * this.weight + 6.25 * this.height - 5 * age + 5);
        } else if (this.gender === "female") {
            return (10 * this.weight + 6.25 * this.height - 5 * age - 161);
        } else {
            throw new Error("Gender phải là 'male' hoặc 'female'");
        }
    }
    getMacroTarget(kcalBurn) {
        const kcalMin = this.getBMR();
        const kcalFull = kcalMin + kcalBurn;
        let kcal;

        if (this.targetWeight < this.weight) {
            kcal = kcalFull - this.kcalChangePerDay; // thâm hụt để giảm cân
        } else if (this.targetWeight > this.weight) {
            kcal = kcalFull + this.kcalChangePerDay; // thặng dư để tăng cân
        } else {
            kcal = kcalFull; // duy trì
        }

        // Tỷ lệ macro (có thể chỉnh theo mục tiêu)
        const ratioProtein = 0.25; // 25% kcal từ protein
        const ratioFat = 0.25;     // 25% kcal từ fat
        const ratioCarb = 0.50;    // 50% kcal từ carb

        // Tính kcal cho từng nhóm
        const proteinKcal = kcal * ratioProtein;
        const fatKcal = kcal * ratioFat;
        const carbKcal = kcal * ratioCarb;

        // Đổi kcal sang gram
        const protein = proteinKcal / 4; // g
        const fat = fatKcal / 9;         // g
        const carb = carbKcal / 4;       // g

        // Fiber: cố định theo khuyến nghị
        const fiber = 30;

        return {
            protein: Math.round(protein),
            carb: Math.round(carb),
            fat: Math.round(fat),
            fiber: fiber,
            kcal: Math.round(kcal)
        };
    }
    getStatus() {
        return {
            BMI: `${this.getBMI().toFixed(0)}`,
            BMIConclusion: this.getBMIConclusion(),
            BMR: `${this.getBMR().toFixed(0)} kcal/day`,
            Weight: `${this.weight} kg`,
            IdealWeight: `${this.getIdealWeight()} kg`,
            TargetWeight: `${this.targetWeight} kg`,
            SuggestMonths: this.getMonthsToGetTargetWeight().toFixed(1),
        };
    }
}


//#region Data
class Data {
    constructor(
        foods=new Foods(), 
        meals=new Meals(),
        exercises = new Exercises(),
        workouts = new Workouts(),
        human = new Human(),
    ) {
        this.foods = foods;
        this.meals = meals;
        this.exercises = exercises;
        this.workouts = workouts;
        this.human = human;
    }
    getCategoryIdByMeal(meal) {
        const food = this.foods.getFoodById(meal.foodId) || new Food();
        const category = this.foods.getCategoryById(food.categoryId);
        return category.id;
    }
    getMealInfo(foodId, amount) {
        const food = this.foods.getFoodById(foodId) || new Food();
        const category = this.foods.getCategoryById(food.categoryId);
        const mealAmount = parseFloat(amount * food.amount);
        const mealProtein = parseFloat(food.protein * amount);
        const mealCarb = parseFloat(food.carb * amount);
        const mealFat = parseFloat(food.fat * amount);
        const mealFiber = parseFloat(food.fiber * amount);
        const mealKcal = parseFloat(food.kcal * amount);
        let proteinPer = 0;
        let carbPer = 0;
        let fatPer = 0;
        if (mealKcal !== 0) {
            proteinPer = (mealProtein * 4 / mealKcal) * 100;
            carbPer = (mealCarb* 4 / mealKcal) * 100;
            fatPer = (mealFat * 9 / mealKcal) * 100;  
        }
        return {
            categoryName: category.name,
            foodName: food.name,
            amount: mealAmount,
            unit: food.unit,
            protein: mealProtein,
            carb: mealCarb,
            fat: mealFat,
            fiber: mealFiber,
            kcal: mealKcal,
            proteinPercent: proteinPer,
            carbPercent: carbPer,
            fatPercent: fatPer
        };
    }
    getWorkoutInfo(exerciseId, duration) {
        const exercise = this.exercises.getExerciseById(exerciseId) || new Exercise();
        const category = this.exercises.getCategoryById(exercise.categoryId);
        const kcalBurn = (duration / 60) * exercise.kcalPerHour;
        return {
            categoryName: category.name,
            excerciseName: exercise.name,
            kcalBurn: kcalBurn
        }
    }
    getNutritionMacroByDate(date) {
        let sumProtein = 0;
        let sumCarb = 0;
        let sumFat = 0;
        let sumFiber = 0;
        let sumKcal = 0;

        const mealFilter = this.meals.getMealsByDate(date);
        mealFilter.forEach(meal => {
            const mealMacro = this.getMealInfo(meal.foodId, meal.amount);
            sumProtein += mealMacro.protein;
            sumCarb += mealMacro.carb;
            sumFat += mealMacro.fat;
            sumFiber += mealMacro.fiber;
            sumKcal += mealMacro.kcal;
        });

        return {
            protein: sumProtein,
            carb: sumCarb,
            fat: sumFat,
            fiber: sumFiber,
            kcal: sumKcal,
        };
    }
    getTotalKcalWorkoutByDate(date) {
        let totalKcalBurn = 0;

        const workoutsFilter = this.workouts.getWorkoutsByDate(date);
        workoutsFilter.forEach(workout => {
            const workouInfo = this.getWorkoutInfo(workout.exerciseId, workout.duration)
            totalKcalBurn += workouInfo.kcalBurn;
        })
        return totalKcalBurn;
    }
    getCategoryIdByWorkout(workout) {
        const exercise = this.exercises.getExerciseById(workout.exerciseId) || new Exercise();
        const category = this.exercises.getCategoryById(exercise.categoryId);
        return category.id;
    }
    getKcalByWeek(date) {
        const workoutsFiler = this.workouts.getWokoutsByWeek(date);
        let sum = 0;
        workoutsFiler.forEach(workout => {
            const info = this.getWorkoutInfo(workout.exerciseId, workout.duration);
            sum += info.kcalBurn;
        });
        return sum;
    }
    getMacroTarget(date) {
        const kcalBurn = this.getTotalKcalWorkoutByDate(date)
        const target = this.human.getMacroTarget(kcalBurn);
        return target;
    }
    //#region DefaultNutrion
    createDefaultNutrition() {
        const foods = new Foods();
        const meals = new Meals();

        // Category mặc định
        const catMain = new FoodCategory("c1", "Món chính");
        const catSnack = new FoodCategory("c2", "Món ăn nhẹ");
        const catFruit = new FoodCategory("c3", "Trái cây");
        const catDrink = new FoodCategory("c4", "Nước");
        const catUnknow = new FoodCategory();

        foods.addCategory(catMain);
        foods.addCategory(catSnack);
        foods.addCategory(catFruit);
        foods.addCategory(catDrink);
        foods.addCategory(catUnknow);

        // Món chính
        foods.addFood(new Food("f1", "Cơm tấm sườn", "c1", 1, "phần", 25, 60, 20, 5));
        foods.addFood(new Food("f2", "Hủ tiếu mì thịt", "c1", 1, "tô", 20, 55, 15, 4));
        foods.addFood(new Food("f3", "Bún bò Huế", "c1", 1, "tô", 22, 50, 10, 3));

        // Món ăn nhẹ
        foods.addFood(new Food("f4", "Bột chiên trứng", "c2", 1, "dĩa", 12, 40, 20, 2));
        foods.addFood(new Food("f5", "Gỏi cuốn", "c2", 1, "cuốn", 5, 10, 2, 1));
        foods.addFood(new Food("f6", "Bì cuốn", "c2", 1, "cuốn", 6, 12, 3, 1));
        foods.addFood(new Food("f7", "Bột chiên", "c2", 1, "dĩa", 10, 35, 18, 2));

        // Trái cây
        foods.addFood(new Food("f8", "Táo", "c3", 100, "g", 0.3, 14, 0.2, 2.4));
        foods.addFood(new Food("f9", "Chuối", "c3", 100, "g", 1.1, 23, 0.3, 2.6));
        foods.addFood(new Food("f10", "Nho", "c3", 100, "g", 0.7, 18, 0.2, 0.9));

        // Nước
        foods.addFood(new Food("f11", "Nước cam", "c4", 1, "ly", 2, 26, 0.5, 0.5));
        foods.addFood(new Food("f12", "Nước mía", "c4", 1, "ly", 0, 65, 0, 0));
        foods.addFood(new Food("f13", "Nước dừa", "c4", 1, "ly", 1, 9, 0.5, 2));

        // Food Unknown
        foods.addFood(new Food());

        // Meal mẫu (có thể thêm vài món để demo)
        meals.addMeal(new Meal("m1", "f1", 1, new Date())); // ăn cơm tấm sườn
        meals.addMeal(new Meal("m2", "f8", 2, new Date())); // ăn táo
        meals.addMeal(new Meal("m3", "f11", 1, new Date())); // uống nước cam

        this.foods = foods;
        this.meals = meals;
    }
    //#region DefaultTraining
    createDefaultTraining() {
        const exercises = new Exercises();
        const workouts = new Workouts();

        // Category mặc định
        const catAerobic = new ExerciseCategory("ec1", "Aerobic");
        const catStrength = new ExerciseCategory("ec2", "Strength");
        const catFlexibility = new ExerciseCategory("ec3", "Flexibility");
        const catBalance = new ExerciseCategory("ec4", "Balance");
        const catUnknow = new ExerciseCategory();

        exercises.addCategory(catAerobic);
        exercises.addCategory(catStrength);
        exercises.addCategory(catFlexibility);
        exercises.addCategory(catBalance);
        exercises.addCategory(catUnknow);

        // Aerobic
        exercises.addExercise(new Exercise("e1", "ec1", "Running", 500));
        exercises.addExercise(new Exercise("e2", "ec1", "Biking", 400));
        exercises.addExercise(new Exercise("e3", "ec1", "Swimming", 300));

        // Strength
        exercises.addExercise(new Exercise("e4", "ec2", "Pull-ups", 300));
        exercises.addExercise(new Exercise("e5", "ec2", "Push-ups", 400));
        exercises.addExercise(new Exercise("e6", "ec2", "Bench Press", 200));

        // Flexibility
        exercises.addExercise(new Exercise("e7", "ec3", "Yoga", 200));
        exercises.addExercise(new Exercise("e8", "ec3", "Stretching", 150));

        // Balance
        exercises.addExercise(new Exercise("e9", "ec4", "Tai Chi", 200));
        exercises.addExercise(new Exercise("e10", "ec4", "Plank", 250));

        // Exercise Unknown
        exercises.addExercise(new Exercise());

        // Workouts mẫu (có thể thêm vài món để demo)
        workouts.addWorkout(new Workout("w1", "e1", 30, new Date())); // Running
        const benchPress = new Workout("w2", "e6", 10, new Date()); // BenchPress
        benchPress.sets = [
            {reps: 12, volume: 10},
            {reps: 10, volume: 15},
            {reps: 8, volume: 20},
            {reps: 6, volume: 25},
        ];
        workouts.addWorkout(benchPress); 
        workouts.addWorkout(new Workout("w3", "e10", 5, new Date())); // Plank

        this.exercises = exercises;
        this.workouts = workouts;
    }
    //#region DefaultHuman
    createDefaultHuman() {
        const today = Helper.dateToString(new Date());
        const human = new Human('male', 1984, 167, 75, 68, 500, [{date: today, weight: 75}]);
        this.human = human;
    }
    clear() {
        this.foods = new Foods();
        this.meals = new Meals();
        this.exercises = new Exercises();
        this.workouts = new Workouts();
        this.human = new Human()
        this.save();
    }
    exportJsonString() {
        const dataSave = {
            foods: this.foods,
            meals: this.meals,
            exercises: this.exercises,
            workouts: this.workouts,
            human: this.human,
        }
        return JSON.stringify(dataSave, null, 2);
    }
    import(object) {
        this.clear();

        // Create Category of Food
        object.foods.categories.forEach(foodCategoryObj => {
            const newFoodCategory = FoodCategory.fromObj(foodCategoryObj);
            this.foods.addCategory(newFoodCategory);
        });

        // Create List of Foods
        object.foods.list.forEach(foodObj => {
            this.foods.addFood(Food.fromObj(foodObj));
        });

        // Create List of Meals
        object.meals.list.forEach(mealObj => {
            this.meals.addMeal(Meal.fromObj(mealObj));
        });

        // Create Exercise Category
        object.exercises.categories.forEach(exerciseCategoryObj => {
            this.exercises.addCategory(ExerciseCategory.fromObj(exerciseCategoryObj));
        });

        // Create List of Exercises
        object.exercises.list.forEach(exerciseObj => {
            this.exercises.addExercise(Exercise.fromObj(exerciseObj));
        });

        // Create List of Workouts
        object.workouts.list.forEach(workoutObj => {
            this.workouts.addWorkout(Workout.fromObj(workoutObj));
        });

        // Create Human
        this.human = Human.fromObj(object.human);

        this.save();
    }
    save() {
        const appName = "super-simple-fitness"
        const jsonString = this.exportJsonString();
        localStorage.setItem(appName, jsonString)
    }
    load() {
        const appName = "super-simple-fitness";
        const raw = localStorage.getItem(appName);
        if (raw) {

            try {
                const object = JSON.parse(raw);
                this.import(object);
            } catch {
                this.createDefaultNutrition();
                this.createDefaultTraining();
                this.createDefaultHuman();
            }
        }

    }
}

//#region Load
const dataTemp = new Data();
document.addEventListener("DOMContentLoaded", () => {
    dataTemp.load()
})