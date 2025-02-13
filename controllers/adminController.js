import User from "../Model/User.js";
import asyncHandler from '../utils/asyncHandler'
import ApiError from '../utils/Apierror.js'
import  Apiresponse from '../utils/Apiresponse'
import { Question } from "../Model/Question.js";

const addquestions = asyncHandler( async (req, res) => {
  try {
    const { category, difficulty, search, limit = 10, page = 1 } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    const questions = await Question.find(query)
      .select('-correctAnswer') // Don't send correct answer to client
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const updatequestion= asyncHandler( async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .select('-correctAnswer');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

 const userdetail=asyncHandler( async (req, res) => {
  try {
    const { answer } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = answer === question.correctAnswer;

    // Update user's progress
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        'progress.completedQuestions': 1,
        'progress.correctAnswers': isCorrect ? 1 : 0
      }
    });

    res.json({
      isCorrect,
      explanation: question.explanation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



export  {addquestions,updatequestion,userdetail}