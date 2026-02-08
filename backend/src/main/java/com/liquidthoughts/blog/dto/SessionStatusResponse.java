package com.liquidthoughts.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SessionStatusResponse {

    private boolean loggedIn;
    private String username;
}
