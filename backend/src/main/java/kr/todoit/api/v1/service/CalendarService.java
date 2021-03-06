package kr.todoit.api.v1.service;

import kr.todoit.api.v1.domain.Calendar;
import kr.todoit.api.v1.domain.CalendarGroup;
import kr.todoit.api.v1.domain.User;
import kr.todoit.api.v1.dto.*;
import kr.todoit.api.v1.exception.CustomException;
import kr.todoit.api.v1.exception.ExceptionType;
import kr.todoit.api.v1.mapper.CalendarMapper;
import kr.todoit.api.v1.mapper.UserMapper;
import kr.todoit.api.v1.repository.CalendarGroupRepository;
import kr.todoit.api.v1.repository.CalendarRepository;
import kr.todoit.api.v1.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class CalendarService {

    private CalendarRepository calendarRepository;
    private CalendarGroupRepository calendarGroupRepository;
    private CalendarMapper calendarMapper;
    private UserRepository userRepository;
    private ImageService imageService;
    private UserMapper userMapper;

    public List<CalendarListResponse> find(CalendarIndexRequest calendarIndexRequest) {
        List<CalendarListResponse> calendarListResponses = new ArrayList<>();

        // 특정 유저가 구독한 모든 캘린더 리스트를 불러온다.
        List<HashMap<String, Object>> calendars = calendarMapper.findAllByUserId(calendarIndexRequest.getUserId());
        return getCalendarListResponses(calendarListResponses, calendars);
    }

    public List<CalendarListResponse> find(Long userId) {
        System.out.println(userId);
        List<CalendarListResponse> calendarListResponses = new ArrayList<>();

        // 특정 유저가 구독한 모든 캘린더 리스트를 불러온다.
        List<HashMap<String, Object>> calendars = calendarMapper.findAllByUserId(userId);
        return getCalendarListResponses(calendarListResponses, calendars);
    }

    private List<CalendarListResponse> getCalendarListResponses(List<CalendarListResponse> calendarListResponses, List<HashMap<String, Object>> calendars) {
        for(HashMap<String, Object> calendar : calendars){
            List<User> _users = new ArrayList<>();
            List<HashMap<String, Object>> users = userMapper.findAllByCalendarId(Long.valueOf(calendar.get("id").toString()));

            for(HashMap<String, Object> user : users){
                User _user = User.builder()
                        .id(Long.parseLong(user.get("id").toString()))
                        .nickname(user.get("nickname").toString())
                        .userCode(user.get("user_code").toString())
                        .profileImg(user.get("profile_preview_img").toString())
                        .profilePreviewImg(user.get("profile_preview_img").toString())
                        .build();
                _users.add(_user);
            }

            CalendarListResponse calendarListResponse = CalendarListResponse.of(calendar, _users);
            calendarListResponses.add(calendarListResponse);
        }
        return calendarListResponses;
    }

    public List<CalendarListResponse> store(CalendarStoreRequest storeRequest) throws IOException {

        if(storeRequest.getThumbnail() != null){
            log.info("캘린더 썸네일 파일 존재 -> 썸네일, 썸네일 프리뷰 이미지 생성,");
            HashMap<String, String> imageNameMap = imageService.upload(storeRequest.getThumbnail());
            storeRequest.setThumbnailPath(imageNameMap.get("origin"));
            storeRequest.setThumbnailPreviewPath(imageNameMap.get("preview"));
        }
        log.info("캘린더 생성");
        User user = userRepository.findUserById(storeRequest.getUserId());
        Calendar calendar = storeRequest.toCalendar(user);
        calendarRepository.save(calendar);

        log.info("캘린더 그룹 생성");
        CalendarGroup calendarGroup = storeRequest.toCalendarGroup(calendar, user);
        calendarGroupRepository.save(calendarGroup);

        return find(storeRequest.getUserId());
    }

    public void edit(CalendarEditRequest editRequest) throws IOException {
        Calendar calendar = calendarRepository.findCalendarById(editRequest.getId());
        if(editRequest.getThumbnail() != null){
            log.info("캘린더 썸네일 파일 존재 -> 이전 썸네일, 썸네일 프리뷰 이미지 삭제,");
            imageService.delete(calendar.getThumbnail());
            imageService.delete(calendar.getThumbnailPreview());


            log.info("캘린더 썸네일 파일 존재 -> 썸네일, 썸네일 프리뷰 이미지 생성,");
            HashMap<String, String> imageNameMap = imageService.upload(editRequest.getThumbnail());
            calendar.setThumbnail(imageNameMap.get("origin"));
            calendar.setThumbnailPreview(imageNameMap.get("preview"));
        }
        if(editRequest.getName() != null && !editRequest.getName().equals("")){
            calendar.setName(editRequest.getName());
        }
        if(editRequest.getIsPrivate() != null){
            calendar.setIsPrivate(editRequest.getIsPrivate());
        }
    }

    public void delete(Long id) {
        log.info("캘린더 삭제");
        Calendar calendar = calendarRepository.findCalendarById(id);
        if(calendar.getIsDefault() == 1){
            throw new CustomException(ExceptionType.NOT_DELETED_DEFAULT_CALENDAR);
        }
        imageService.delete(calendar.getThumbnail());
        imageService.delete(calendar.getThumbnailPreview());
        calendarRepository.delete(calendar);
    }

    public void deleteImages(Long id) {
        log.info("캘린더 썸네일 삭제");
        Calendar calendar = calendarRepository.findCalendarById(id);
        imageService.delete(calendar.getThumbnail());
        imageService.delete(calendar.getThumbnailPreview());
        calendar.setThumbnail("");
        calendar.setThumbnailPreview("");
    }
}
