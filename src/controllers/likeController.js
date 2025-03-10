import likeService from '../services/likeService';
import loggerHelpers from '../helpers/loggerHelpers';
import { recordStartTime } from '../utils/loggerFormat';

import * as ApiErrors from '../errors';

export default {
    like: (req, res, next) => {
        try {
            const postId = req.params.id;// id bài viết
            const userId = req.auth.userId;// id người like


            // console.log("postIdpostId", postId);
            // console.log("userIduserId", userId);

            const param = { postId, userId };

            // console.log("param", param);

            likeService
                .like(param)
                .then(result => {
                    if (result && result.success) {
                        const dataOutput = {
                            result: null,
                            success: true,
                            errors: [],
                            messages: [result.message]
                        };

                        res.status(200).json(dataOutput);
                        recordStartTime.call(res);
                        loggerHelpers.logUpdate(req, res, {
                            dataReqBody: req.body,
                            dataReqQuery: req.query,
                            dataRes: dataOutput
                        });
                    } else {
                        throw new ApiErrors.BaseError({
                            statusCode: 202,
                            type: 'likeError',
                            message: 'Không thể like bài viết.'
                        });
                    }
                })
                .catch(error => {
                    console.log("errrrrrrrrrrr", error);
                    error.dataParams = req.params; // Ghi nhận thông tin lỗi liên quan đến params
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    }
};
