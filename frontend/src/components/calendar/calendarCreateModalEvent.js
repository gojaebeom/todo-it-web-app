import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import { calendarsState } from '../../states/calendarsState'
import { calendarStoreState } from '../../states/calendarStoreState'
import { creationCalendarModalState } from '../../states/ui/creationCalendarModalState'
import { toastState } from '../../states/ui/toastState'
import { userState } from '../../states/userState'
import ApiScaffold from '../../customs/api'
import readImgFile from '../../customs/readImgFile'
import sleep from '../../customs/sleep'

const calendarCreateModalEvent = (Compoent) => {
  return () => {
    const setToast = useSetRecoilState(toastState)

    const user = useRecoilValue(userState)
    const [storeCalendar, setStoreCalendar] = useRecoilState(calendarStoreState)
    const [
      creationCalendarModalOpen,
      setCreationCalendarModalOpen,
    ] = useRecoilState(creationCalendarModalState)
    const setCalendars = useSetRecoilState(calendarsState)
    const resetCalendarStore = useResetRecoilState(calendarStoreState)

    const clickCreationCalendarModalCloseEvent = (e) => {
      resetCalendarStore()
      setCreationCalendarModalOpen({ open: false, submit: false })
    }

    const changeImageEvent = (e) => {
      readImgFile(e, (event, file) => {
        setStoreCalendar({
          ...storeCalendar,
          thumbnail: event.target.result,
          thumbnailFile: file,
        })
      })
    }

    const changeInputEvent = (e) => {
      const name = e.target.name
      const value = e.target.value

      if (name === 'isPrivate') {
        setStoreCalendar({
          ...storeCalendar,
          isPrivate: storeCalendar.isPrivate === 0 ? 1 : 0,
        })
      } else {
        setStoreCalendar({ ...storeCalendar, name: value })
      }
    }

    const submitCalendarEvent = async () => {
      if (!storeCalendar.name)
        return setToast({
          open: true,
          message: '캘린더 이름은 필수값입니다!',
          type: 'WARNING',
          second: 2000,
        })

      setCreationCalendarModalOpen({
        ...creationCalendarModalOpen,
        submit: true,
      })

      const formData = new FormData()
      formData.append('userId', user.id)
      if (storeCalendar.name) formData.append('name', storeCalendar.name)
      if (storeCalendar.thumbnail)
        formData.append('thumbnail', storeCalendar.thumbnailFile)
      formData.append('isPrivate', storeCalendar.isPrivate)

      const res = await ApiScaffold(
        {
          method: 'post',
          url: '/calendars',
          data: formData,
        },
        (err) => {
          alert(err.data.message)
          setCreationCalendarModalOpen({
            ...creationCalendarModalOpen,
            submit: false,
          })
          throw new Error(err.data)
        },
      )
      sleep(500)
      setCalendars([...res.data])
      setCreationCalendarModalOpen({
        ...creationCalendarModalOpen,
        open: false,
        submit: false,
      })
    }

    return (
      <Compoent
        changeImageEvent={changeImageEvent}
        storeCalendar={storeCalendar}
        changeInputEvent={changeInputEvent}
        submitCalendarEvent={submitCalendarEvent}
        clickCreationCalendarModalCloseEvent={
          clickCreationCalendarModalCloseEvent
        }
        creationCalendarModalOpen={creationCalendarModalOpen}
      />
    )
  }
}
export default calendarCreateModalEvent
