package com.liquidthoughts.blog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("posts")
public class PostEntity {

    @TableId(type = IdType.INPUT)
    private String id;

    private String title;

    private String content;

    private String summary;

    private String status;

    @TableField("category_id")
    private Integer categoryId;

    @TableField("created_at")
    private String createdAt;

    @TableField("updated_at")
    private String updatedAt;

    @TableField(exist = false)
    private Integer viewCount;

    @TableField(exist = false)
    private Integer likeCount;
}
