import emptyImg from "../../../assets/images/null.png";
import {useRecoilState, useResetRecoilState} from "recoil";
import {todosState} from "../../../atoms/todosState";
import {useState} from "react";
import {todoStoreState} from "../../../atoms/todoStoreState";

const TodoIsNull = () =>{
    const [todos, setTodos] = useRecoilState(todosState);
    const [ formIsOpen, setFormIsOpen ] = useState(false);
    const resetTodoStore =  useResetRecoilState(todoStoreState);
    const storeTodoFormToggle = () => {
        resetTodoStore();
        setFormIsOpen(!formIsOpen);
    }
    return(
    todos.length === 0 &&
    <div className="fixed flex flex-col items-center justify-center h-full">
        <img src={emptyImg} alt="img" className="mb-2"/>
        <p className="text-lg">일정이 없습니다.</p>
        <p className="text-sm font-noto-thin">새로운 일정을 추가해보세요!</p>
        <button className="px-4 py-1 mt-5 text-lg text-white bg-red-300 rounded-sm"
                onClick={storeTodoFormToggle}
        >
            일정 추가
        </button>
    </div>
    )
}
export default TodoIsNull;