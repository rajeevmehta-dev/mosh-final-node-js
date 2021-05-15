const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/mosh-practice', { useNewUrlParser: true });
const courseSchema = new Schema({
    name: {
        type: String, required: true,
        minLength: 5,
        maxLength: 255
        //match: /pattern/ 
    },
    author: { type: String },
    category: {
        type: String,
        enum: ['Thriller', 'Horror', 'Survival'],
        lowercase: true,
        //uppercase:true
        trim: true       //automatically removes extra spaces
    },
    tags: {
        type: Array,

        /*  validate: {
              isAsync:true,
              validator: function (v, callback) {
                  callback(v && v.length > 0);
  
              }
          },       DEPRECATED     */
        validate:
            function (v) {
                return new Promise(function (resolve, reject) {
                    setTimeout(() => {
                        resolve(v && v.length > 0);
                    }, (3000))

                });
            }
    },
    //[String],
    date: { type: Date, default: Date.now },
    isPublished: { type: Boolean },
    price: {
        type: Number,
        required: function () { return this.isPublished },
        min: 10,
        max: 200,     //can also be used for dates,
        set: v => Math.round(v), // in case the value is stored as float in DB, but you want to floor it when getting it
        get: v => Math.round(v) // to set the incoming value from float to int in DB
    }
}, { versionKey: false });

const Course = mongoose.model('books', courseSchema);


async function createCourse() {

    var course = new Course({
        name: "XYZ Book",
        author: "Adesh",
        category: 'Thriller',
        //tags: ['Thriller', 'Horror', 'Survival'],
        tags: [],
        isPublished: true,
        price: 100
    });

    /* Using async/await
     try {
         const result = await course.save();
         console.log(result);
     }
     catch (e) {
         console.log(e.message);
     }   */

    //Using Callback
    course.save(function (err, result) {
        if (err) console.log(err.message);
        else console.log(result);

    });
}

async function deleteCourses() {
    /* Using async/await
    try {
        const result = await Course.deleteMany()
        console.log(result);
    }
    catch (e) {
        console.log(e.message);
    }   */

    //Using Callback
    Course.deleteMany(function (err, result) {
        if (err) console.log(err)
        else console.log(result);
    });

}
createCourse();
// deleteCourses();