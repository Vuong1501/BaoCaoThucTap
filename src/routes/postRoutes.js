import { Router } from 'express';


import postController from '../controllers/postController';
import postValidate from '../validates//postValidate';


const router = Router();

router.post('/', postValidate.authenCreate, postController.create);

router.get('/getAllPost', postController.allPost);

router.get('/', postValidate.authenFilter, postController.get_list);// lấy ra tất cả bài viết của mình

router.get('/:id', postController.getPublicAndFriendPost); // như là vào trang cá nhân của người khác

router.put('/:id', postValidate.authenUpdate, postController.update); // giống lướt trang chủ ở fb

router.delete('/:id', postController.delete);



export default router;