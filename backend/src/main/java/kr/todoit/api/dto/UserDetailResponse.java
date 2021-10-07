package kr.todoit.api.dto;

import lombok.Getter;

@Getter
public class UserDetailResponse {
    private Long id;
    private String email;
    private String nickname;
    private String userCode;
    private String profilePreviewImg;
    private String createdAt;
}
