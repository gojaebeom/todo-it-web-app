package kr.todoit.api.service;

import kr.todoit.api.domain.Calendar;
import kr.todoit.api.domain.CalendarCustomize;
import kr.todoit.api.domain.User;
import kr.todoit.api.dto.CustomizeFindRequest;
import kr.todoit.api.dto.CustomizeFindResponse;
import kr.todoit.api.dto.CustomizeStoreRequest;
import kr.todoit.api.repository.CalendarCustomizeRepository;
import kr.todoit.api.repository.CalendarRepository;
import kr.todoit.api.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class CalendarCustomizeService {

    private CalendarRepository calendarRepository;
    private CalendarCustomizeRepository calendarCustomizeRepository;
    private UserRepository userRepository;

    public List<CustomizeFindResponse> findByOptions(CustomizeFindRequest customizeFindRequest) {
        List<CalendarCustomize> calendarCustomizeList = calendarCustomizeRepository.findByUserIdAndCalendarId(
                customizeFindRequest.getUserId(),
                customizeFindRequest.getCalendarId()
        );

        List<CustomizeFindResponse> customizeFindResponses = new ArrayList<>();
        for(CalendarCustomize calendarCustomize : calendarCustomizeList){
            CustomizeFindResponse customizeFindResponse = CustomizeFindResponse.of(calendarCustomize);
            customizeFindResponses.add(customizeFindResponse);
        }

        return customizeFindResponses;
    }

    public void store(CustomizeStoreRequest customizeStoreRequest) {
        System.out.println(customizeStoreRequest);
        CalendarCustomize _calendarCustomize = calendarCustomizeRepository.findByUserIdAndCalendarIdAndMatchedDate(
                customizeStoreRequest.getUserId(),
                customizeStoreRequest.getCalendarId(),
                customizeStoreRequest.getMatchedDate()
        );

        User user = userRepository.getById(customizeStoreRequest.getUserId());

        if(_calendarCustomize != null){
            if(customizeStoreRequest.getColor().equals("white")){
                delete(_calendarCustomize.getId());
            }else{
                _calendarCustomize.setColor(customizeStoreRequest.getColor());
            }
        }else{
            if(!customizeStoreRequest.getColor().equals("white")){
                Calendar calendar = calendarRepository.getById(customizeStoreRequest.getCalendarId());
                CalendarCustomize calendarCustomize = customizeStoreRequest.toCalendarCustomize(user, calendar);
                calendarCustomizeRepository.save(calendarCustomize);
            }
        }
    }

    public void delete(Long id) {
        calendarCustomizeRepository.deleteById(id);
    }
}
