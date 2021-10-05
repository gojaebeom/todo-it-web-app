package kr.todoit.api.service;

import kr.todoit.api.domain.User;
import kr.todoit.api.dto.*;
import kr.todoit.api.mapper.UserMapper;
import kr.todoit.api.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.naming.AuthenticationException;
import java.io.IOException;
import java.util.HashMap;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class UserService {

    private TokenService tokenService;
    private UserRepository userRepository;
    private UserMapper userMapper;
    private CalendarService calendarService;
    private ImageService imageService;

    public TokenResponse joinByOauth(UserJoinRequest userJoinRequest) throws AuthenticationException, IOException {
        User user = userRepository.findByEmail(userJoinRequest.getEmail());

        if(user == null){
            log.info("회원등록이 안된 유저 -> 회원가입 진행");

            String randomCode;
            while (true){
                log.info("랜덤 닉네임 추출 -> 중복시 반복");
                String randomUUID = UUID.randomUUID().toString();
                randomCode = randomUUID.split("-")[4];
                Short userCodeCount = userRepository.countByUserCode(randomCode);
                if(userCodeCount == 0) break;
            }

            userJoinRequest.setUserCode(randomCode);
            user = userJoinRequest.toUser();
            userRepository.save(user);

            CalendarStoreRequest calendarStoreRequest = CalendarStoreRequest.builder()
                    .userId(user.getId())
                    .name("개인일정")
                    .isPrivate((byte) 1)
                    .build();
            calendarService.store(calendarStoreRequest);
        }

        log.info("자동로그인 진행 -> 토큰 발급");
        HashMap<String, Object> actInfo = tokenService.getAct(user.getId());
        HashMap<String, Object> rftInfo = tokenService.getRft(user.getId());

        return TokenResponse.builder()
                .actInfo(actInfo)
                .rftInfo(rftInfo)
                .build();
    }

    public UserDetailWithCalendarsResponse show(Long id) {
        return userMapper.findOneWithCalendarsById(id);
    }

    public void delete(Long id) {
        log.info("회원삭제");
        User user = userRepository.findUserById(id);
        userRepository.delete(user);
    }

    public UserDetailResponse edit(UserEditRequest userEditRequest) throws IOException {
        User user = userRepository.findUserById(userEditRequest.getId());
        if(userEditRequest.getProfileImg() != null){
            log.info("유저 프로필 파일 존재 -> 프로필, 프로필 프리뷰 이미지 생성,");
            HashMap<String, String> imageNameMap = imageService.upload(userEditRequest.getProfileImg());
            user.setProfileImg(imageNameMap.get("origin"));
            user.setProfilePreviewImg(imageNameMap.get("preview"));
        }
        if(userEditRequest.getNickname() != null){
            user.setNickname(userEditRequest.getNickname());
        }

        return UserDetailResponse.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .profileImg(user.getProfileImg())
                .profilePreviewImg(user.getProfilePreviewImg())
                .userCode(user.getUserCode())
                .createdAt(user.getCreatedAt())
                .build();
        // return userMapper.findOneById(userEditRequest.getId());
    }
}
