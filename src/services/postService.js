// import moment from 'moment'
import MODELS from '../models/models';
import models from '../entity/index';
import _, { includes, replace } from 'lodash';
import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';
import filterHelpers from '../helpers/filterHelpers';
import preCheckHelpers, { TYPE_CHECK } from '../helpers/preCheckHelpers';
import { Op, where } from 'sequelize';
import order from '../locales/vi-Vn/order';

const { users, friend, sequelize, requestFriend, post } = models;

export default {
    get_list: async param => {
        let finnalyResult;
        const { filter, range, sort, attributes, userId } = param;
        // const { userId } = param;
        const perPage = range[1] - range[0] + 1; // số lượng bản ghi mỗi trang
        const page = Math.floor(range[0] / perPage);
        const att = filterHelpers.atrributesHelper(attributes);
        const result = await Promise.all([
            MODELS.findAndCountAll(post, {
                where: {
                    user_id: userId
                },
                order: sort,
                offset: range[0],
                limit: perPage,
                attributes: att,
                // distinct: true,
                logging: true,
            })
        ]);
        finnalyResult = {
            rows: result[0].rows,
            count: result[0].count,
            page: page + 1,
            perPage
        };
        return finnalyResult;
    },
    create: async param => {
        const { userId, content, visibility } = param;
        console.log("content", content);
        console.log("visibility", visibility);
        console.log("userId", userId);


        // Tạo bài viết mới
        const newPost = await post.create({
            user_id: userId,
            content,
            visibility,
            total_likes: 0,
            total_comments: 0
        });

        console.log("newPost", newPost);

        return newPost;
    },
    update: async param => {
        const { postId, userId, content, visibility } = param;

        // tìm bài viết 
        const existPost = await post.findOne({
            where: { id: postId, user_id: userId }
        });

        console.log("posttt", existPost);
        if (!post) {
            throw new ApiErrors.BaseError({
                statusCode: 404,
                type: 'crudNotExisted',
                message: 'Bài viết không tồn tại hoặc bạn không có quyền cập nhật.'
            });
        }

        const updatedPost = await existPost.update(
            {
                content: content || existPost.content, // Giữ nguyên nếu không có giá trị mới
                visibility: visibility || existPost.visibility
            },
            {
                where: { id: postId, user_id: userId } // Điều kiện cập nhật
            }
        );

        return updatedPost;
    },
    delete: async param => {
        const { userId, postId } = param;
        console.log("userId", userId);
        console.log("postId", postId);

        // tìm bài viết để xóa
        const postDelete = await post.findOne({
            where: {
                id: postId,
                user_id: userId
            }
        });
        console.log("postDelete", postDelete);

        if (!postDelete) {
            throw new ApiErrors.BaseError({
                statusCode: 404,
                type: 'crudNotExisted',
                message: 'Bài viết không tồn tại hoặc bạn không có quyền xóa bài viết này.'
            });
        };

        await postDelete.destroy();
        return { status: 1 };
    },
    getPublicAndFriendPosts: async param => {
        const { userId, differentUserId } = param;

        // kiểm tra xem có mối quan hệ bạn bè hay không
        const isFriend = await friend.findOne({
            where: {
                user1_id: userId, user2_id: differentUserId,

            }
        });
        // lấy ra danh sách bài viết chế độ công khai của differentUserId
        const whereCondition = {
            user_id: differentUserId,
            visibility: {
                [Op.or]: ['public']
            }
        };
        console.log("whereCondition.visibility", whereCondition.visibility[Op.or]);

        if (isFriend) {
            whereCondition.visibility[Op.or].push('friends');
        }

        // lấy ra các bài viết
        const postList = await post.findAll({
            where: whereCondition,
            order: [['created_at', 'DESC']],
            logging: true,
        });
        return postList;
    },
    allPost: async param => {
        const { range, userId } = param;

        const perPage = range[1] - range[0] + 1; // số lượng bản ghi mỗi trang
        const offset = range[0];
        console.log("perPage", perPage);
        console.log("offset", offset);

        const startTime = new Date();
        const totalQuery = `
            select count(p.id) as total
            from posts p
            left join friend f on (f.user1_id = p.user_id and f.user2_id = :userId)
            where p.visibility = 'public'
                or (p.visibility = 'friends' and f.id is not null )
            order by p.created_at DESC
            
        `
        const query = `
            select 
                p.id AS post_id, 
                p.user_id,
                p.content,
                p.visibility,
                p.created_at,
                count_like,count_comment
            from posts p
            left join friend f on (f.user1_id = p.user_id and f.user2_id = :userId)
                                or (f.user2_id = p.user_id and f.user1_id = :userId)
            where p.visibility = 'public'
                or (p.visibility = 'friends' and f.id is not null )
            order by p.created_at desc
            LIMIT :limit OFFSET :offset
        `;

        // const [total] = await sequelize.query(totalQuery, {
        //     replacements: {
        //         userId,
        //     }
        // });

        // // console.log("totalllllll", total);
        // const [allPosts] = await sequelize.query(query, {
        //     replacements: {
        //         userId,
        //         limit: perPage,
        //         offset
        //     },
        //     logging: true
        // });
        const [total, allPosts] = await Promise.all([
            sequelize.query(totalQuery, {
                replacements: { userId },
            }),
            sequelize.query(query, {
                replacements: { userId, limit: perPage, offset },
            }),
        ]);

        // console.log("totalFriends", [allPosts], new Date() - startTime);
        console.log("Tổng số bài viết", total[0][0].total);
        return {
            rows: allPosts[0],
            page: Math.floor(range[0] / perPage) + 1,
            perPage,
            total
        }
    }
};

// 4212
