package com.liquidthoughts.blog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("categories")
public class CategoryEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String name;

    private String slug;

    private String description;

    private String icon;

    private String color;
}
