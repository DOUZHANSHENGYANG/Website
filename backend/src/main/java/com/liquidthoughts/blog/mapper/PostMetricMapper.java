package com.liquidthoughts.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.liquidthoughts.blog.entity.PostMetricEntity;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

public interface PostMetricMapper extends BaseMapper<PostMetricEntity> {

    @Update("UPDATE post_metrics SET view_count = view_count + 1, updated_at = #{updatedAt} WHERE post_id = #{postId}")
    int incrementView(@Param("postId") String postId, @Param("updatedAt") String updatedAt);

    @Update("UPDATE post_metrics SET like_count = like_count + 1, updated_at = #{updatedAt} WHERE post_id = #{postId}")
    int incrementLike(@Param("postId") String postId, @Param("updatedAt") String updatedAt);

    @Update("UPDATE post_metrics SET like_count = CASE WHEN like_count > 0 THEN like_count - 1 ELSE 0 END, updated_at = #{updatedAt} WHERE post_id = #{postId}")
    int decrementLike(@Param("postId") String postId, @Param("updatedAt") String updatedAt);
}
