package com.liquidthoughts.blog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("configs")
public class ConfigEntity {

    @TableId(value = "config_key", type = IdType.INPUT)
    private String key;

    private String value;

    private String type;
}
