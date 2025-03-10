// import moment from 'moment'
import MODELS from '../models/models';
import models from '../entity/index';
import _, { includes } from 'lodash';
import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';
import filterHelpers from '../helpers/filterHelpers';
import preCheckHelpers, { TYPE_CHECK } from '../helpers/preCheckHelpers';
import { Op, where } from 'sequelize';

const { users, friend, sequelize, requestFriend, post, like } = models;

export default {
    like: async param => {
        const { postId, userId } = param;
        // console.log("postId", postId);
        // console.log("userId", userId);


        // kiểm tra mối quan hệ bạn bè, nếu là bạn bè thì lấy ra được cả bài viết chế độ bạn bè


        // lấy ra bài viết đó
        const postLike = await post.findOne({
            where: {
                id: postId,
                [Op.or]: [
                    { visibility: 'public' },
                    { visibility: 'friends' }
                ]
            }
        });
        // console.log("postLike:", JSON.stringify(postLike, null, 2));
        if (!postLike) {
            throw new ApiErrors.BaseError({
                statusCode: 404,
                type: 'crudNotFound',
                message: 'Bài viết không tồn tại.'
            });
        }

        // kiểm tra mối quan hệ bạn bè
        // console.log("người tạo bài:", postLike.user_id);

        const isFriend = await friend.findOne({
            where: {
                [Op.or]: [
                    { user1_id: userId, user2_id: postLike.user_id },
                    { user1_id: postLike.user_id, user2_id: userId }
                ]
            }
        });

        if (!isFriend && postLike.visibility === 'friends') {
            throw new ApiErrors.BaseError({
                statusCode: 400,
                message: 'không thể like bài viết vì không phải là bạn bè'
            });
        }
        // kiểm tra xem người dùng đã like bài viết chưa

        const existLike = await like.findOne({
            where: {
                post_id: postId,
                user_id: userId
            }
        });

        if (existLike) {
            throw new ApiErrors.BaseError({
                statusCode: 400,
                type: 'alreadyLiked',
                message: 'Bạn đã thích bài viết này rồi.'
            });
        };

        await like.create({
            post_id: postId,
            user_id: userId
        });

        // cập nhật lại số lượt like

        await postLike.update({
            where: { id: postId },
            count_like: postLike.count_like + 1
        });

        return {
            success: true,
            message: 'Like thành công'
        };
    }
};
