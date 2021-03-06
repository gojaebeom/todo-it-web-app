import userUpdateModalEvent from './userUpdateModalEvent'

const UserUpdateModal = ({
  updateUserModalOpen,
  clickUpdateUserModalCloseEvent,
  changeImageEvent,
  deleteImage,
  changeInputEvent,
  clickDeleteUserEvent,
  userEdit,
  submitEvent,
  user,
}) => {
  return (
    updateUserModalOpen.open && (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="flex flex-col items-center p-5 overflow-hidden bg-white rounded-sm w-full h-full sm:w-[400px] sm:h-auto">
          <p className="text-2xl font-noto-medium">회원 정보 수정</p>
          <p className="text-sm">{userEdit.email}</p>
          <label
            className="flex flex-col items-center justify-center w-20 h-20 my-5 border-2 border-gray-500 border-dashed rounded-full cursor-pointer"
            htmlFor="file"
          >
            {!userEdit.profilePreviewImg && user.profilePreviewImg ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/images${user.profilePreviewImg}`}
                alt="img"
                className="w-full h-full rounded-full"
              />
            ) : (
              <>
                {userEdit.profilePreviewImg ? (
                  <img
                    src={userEdit.profilePreviewImg}
                    alt="img"
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <>
                    <i className="text-2xl fas fa-camera"></i>
                    <span className="text-sm">UPLOAD</span>
                  </>
                )}
              </>
            )}
            <input
              id="file"
              type="file"
              className="w-0 h-0"
              onChange={changeImageEvent}
            />
          </label>
          <button className="text-xs" onClick={() => deleteImage(user.id)}>
            이미지 초기화
          </button>

          <div className="w-full">
            <label className="text-xs">유저코드</label>
            <input
              className="w-full p-3 border rounded-sm outline-none"
              placeholder="회원코드"
              value={userEdit.userCode}
              onChange={changeInputEvent}
              name="userCode"
              disabled
            />
          </div>
          <div className="w-full mt-5">
            <label className="text-xs">닉네임</label>
            <input
              className="w-full p-3 border rounded-sm outline-none"
              placeholder="이름 또는 닉네임을 적어주세요."
              value={userEdit.nickname || ''}
              onChange={changeInputEvent}
              name="nickname"
              maxLength={7}
            />
          </div>
          <div className="flex justify-end w-full mt-5">
            <button onClick={clickDeleteUserEvent}>회원 탈퇴</button>
          </div>
          <div className="flex justify-between w-full">
            <button
              className="px-5 py-2 mt-5 rounded-sm font-noto-medium"
              onClick={clickUpdateUserModalCloseEvent}
            >
              취소
            </button>
            <button
              className="flex items-center justify-center px-5 py-2 mt-5 text-white bg-red-400 rounded-sm font-noto-medium"
              onClick={submitEvent}
            >
              {updateUserModalOpen.submit ? (
                <div className="w-3 h-3 mx-2 border-t-2 border-r-2 rounded-full animate-spin"></div>
              ) : (
                '수정'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  )
}
export default userUpdateModalEvent(UserUpdateModal)
