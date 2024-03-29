const asyncHandler = require('../middleware/async')
const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse') 
const Bootcamp = require('../models/Bootcamp')


// @desc            Get All Courses
// @route           GET /api/v1/courses
// @access          Public
exports.getCourses = asyncHandler(async (req,res,next) => {
    let query

    if(req.params.bootcampId){
        const courses = await Course.find({ bootcamp: req.params.bootcampId })
        return res.status(200).json({
            succes : true,
            count : courses.length,
            data : courses
        })
    } else {
       res.status(200).json(res.advancedResults)
    }


})

// @desc            Get a single course by id
// @route           GET /api/v1/courses/:id
// @access          Public
exports.getCourse = asyncHandler(async (req,res,next) => {
  
const course = await Course.findById(req.params.id).populate({
    path : 'bootcamp',
    select : 'name description'
})

if(!course)
{
    return next(new ErrorResponse(`In a course with a id of ${req.params.id}`,404))
}

res.status(200).json({
    success : true,
    data: course
   })

})



// @desc            Add Course
// @route           GET /api/v1/bootcamps/:bootcampId/courses
// @access          Private
exports.addCourse = asyncHandler(async (req,res,next) => {
  req.body.bootcamp = req.params.bootcampId
  req.bosy.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    
    if(!bootcamp)
    {
        return next(new ErrorResponse(`In a course with a id of ${req.params.bootcampId}`,404))
    }
     //Make Usure User is bootcamp owner
     if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to add a course to ${bootcamp._id} this bootcamp`,401)
        )
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success : true,
        data: course
       })
    
    })



    
// @desc            Update the  Course
// @route           PUT /api/v1/courses/:id
// @access          Private
exports.updateCourse = asyncHandler(async (req,res,next) => {
  
      let course = await Course.findById(req.params.id)
      
      if(!course)
      {
          return next(new ErrorResponse(` No course with the isd of ${req.params.bootcampId}`,404))
      }
      
        //Make sure that the user is course owner
     if(Course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update a course to ${course._id} this bootcamp`,401)
        )
    }
  
      course = await Course.findByIdAndUpdate(req.params.id , req.body , {
          new : true,
          runValidators : true
      })
      
      res.status(200).json({
          success : true,
          data: course
         })
      
})


    
// @desc            Delete the  Course
// @route           DELETE /api/v1/courses/:id
// @access          Private
exports.deleteCourse = asyncHandler(async (req,res,next) => {
  
    const course = await Course.findById(req.params.id)
    
    if(!course)
    {
        return next(new ErrorResponse(` No course with the isd of ${req.params.bootcampId}`,404))
    }
       //Make sure that the user is course owner
       if(Course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete a course to ${course._id} this bootcamp`,401)
        )
    }
    
    await course.remove()
    
    res.status(200).json({
        success : true,
        data: {}
       })
    
})