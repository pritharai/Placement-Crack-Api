import  {Router} from  'express';
const router =Router()
import  {GettestbyID,getalltest,Submittestanswers,Starttest} from '../controllers/testController.js';

router.get('/Getallquestions',getalltest );
router.get('GetquestionbyID/:id',GettestbyID );
router.post('/SubmittestAns/:id',Submittestanswers );
router.post('/Starttest/:id',Starttest );

export default router;