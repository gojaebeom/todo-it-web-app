import moment from "moment";
import ApiScaffold from "../../../shared/api";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import { useCalendars } from "../../../atoms/calendarsState";

const Calendar = () => {
    const {
        calendarDetail,
        user,
        setToast,
        setTodosByMonth,
        todosByMonth,
        contextMenu,
        setContextMenu
    } = useCalendars();

    const [today, setToday] = useState(moment());
    const firstWeek = today.clone().startOf('month').week();
    const lastWeek = today.clone().endOf('month').week() === 1 ? 53 : today.clone().endOf('month').week();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        if(calendarDetail.id && user.id){
            const loadRes = await ApiScaffold({
                method: "get",
                url: `/todos?calendarId=${calendarDetail.id}&userId=${user.id}`
            }, (err) => setToast({open:true, message:err, type:"ERROR",second:2000}));
            setTodosByMonth(loadRes.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarDetail.id, setTodosByMonth, user.id]);

    const calendarArray = () =>{
        let result = [];
        let week = firstWeek;

        for(week; week <= lastWeek; week++){
            result = result.concat(
                <tr key={week}>
                {
                // eslint-disable-next-line no-loop-func
                Array(7).fill(0).map((data, index) => {
                    let days = today.clone().startOf('year').week(week).startOf('week').add(index, 'day');
                    return(
                    <td key={index} className={`border h-120 hover:shadow-inner
                        ${ index % 7 === 0 || index % 6 === 0 ? 'bg-gray-100':'' } ${ ( index === 3 && week === 40 ) && 'bg-red-100'}`}
                        onContextMenu={
                            (event) => {
                                console.debug("hello");
                                setContextMenu({
                                    isOpen: true,
                                    matchedCalendarId: calendarDetail.id,
                                    matchedDate: days.format('YYYYMMDD'),
                                });
                                event.preventDefault();
                            }
                        }
                    >
                        <Link
                            to={`/calendars/${calendarDetail.id}/days/${days.format('YYYY-MM-DD')}`}
                            className={`${days.format('MM') !== today.format('MM') && 'opacity-30'} relative flex flex-col justify-start items-end h-full`}
                        >
                            <span className={`mb-2 ${moment().format('YYYYMMDD') === days.format('YYYYMMDD') && 'bg-red-400  text-white rounded-2xl px-2'}`}>
                                {days.format('D')}
                            </span>
                            <ul className="flex flex-col items-start justify-center w-full">
                            {
                                // eslint-disable-next-line array-callback-return
                                todosByMonth.map((item, index) => {
                                    if(days.format('YYYY-MM-DD') === item.matchedDate) {
                                        return(
                                        <li className={`relative w-full text-sm truncate overflow-ellipsis ${ item.isFinished === "1" && "line-through"}`} key={item.id}>
                                            ·{ item.title }
                                        </li>
                                        )
                                    }
                                })
                            }
                            </ul>
                            {
                                (
                                days.format('MM') === today.format('MM') &&
                                contextMenu.isOpen && 
                                contextMenu.matchedCalendarId === calendarDetail.id && 
                                contextMenu.matchedDate === days.format('YYYYMMDD') ) &&
                                <div className="absolute right-0 z-50 flex flex-col items-center justify-center p-1 bg-white border rounded-tr-none shadow-lg top-7 rounded-3xl">
                                    <button className="w-5 h-5 mb-1 bg-white border-2 border-gray-200 rounded-full hover:bg-gray-50"></button>
                                    <button className="w-5 h-5 mb-1 bg-red-100 border-2 border-gray-200 rounded-full hover:bg-red-200"></button>
                                    <button className="w-5 h-5 mb-1 bg-blue-100 border-2 border-gray-200 rounded-full hover:bg-blue-200"></button>
                                    <button className="w-5 h-5 mb-1 bg-green-100 border-2 border-gray-200 rounded-full hover:bg-green-200"></button>
                                    <button className="w-5 h-5 mb-1 bg-yellow-100 border-2 border-gray-200 rounded-full hover:bg-yellow-200"></button>
                                    <button className="w-5 h-5 mb-1 bg-purple-100 border-2 border-gray-200 rounded-full hover:bg-purple-200"></button>
                                    <button className="w-5 h-5 mb-1 bg-indigo-100 border-2 border-gray-200 rounded-full hover:bg-indigo-200"></button>
                                </div>
                            }
                        </Link>
                    </td>
                    );
                })
                }
                </tr>
            )
        }
        return result;
    }

    return (
    <>
        <div className="flex items-center justify-between w-full mb-5">
            <div className="flex items-center justify-start">
                <button
                    className="px-3"
                    onClick={() => setToday(today.clone().subtract(1, 'year'))}
                >
                    <i className="fas fa-angle-double-left"></i>
                </button>
                <div className="flex items-center justify-center">
                    <button
                        className="px-3"
                        onClick={() => setToday(today.clone().subtract(1, 'month'))}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <div className="text-2xl">{today.format('YYYY 년 MM 월')}</div>
                    <button
                        className="px-3"
                        onClick={() => setToday(today.clone().add(1, 'month'))}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
                <button
                    className="px-3"
                    onClick={() => setToday(today.clone().add(1, 'year'))}
                >
                    <i className="fas fa-angle-double-right"></i>
                </button>
            </div>
        </div>

        <table className="w-full mb-10 table-fixed">
            <thead>
            <tr className="text-right">
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
            </tr>
            </thead>
            <tbody>
            { calendarArray() }
            </tbody>
        </table>
    </>
    )
}
export default Calendar;