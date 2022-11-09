// const Counter = ({ onDecrement, onIncrement, value }) => {
//   return (
//     <div className="">
//       <button onClick={onDecrement}> - </button>
//       {value}
//       <button onClick={onIncrement}> + </button>
//     </div>
//   );
// };

// const Square = ({ value }) => {
//   const style = {
//     width: 100 + value * 10,
//     height: 100 + value * 10,
//   };
//   return <div className="square" style={style}></div>;
// };

// // class Couter extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     console.log("Khoi tao component");
// //   }
// // }

// const App = () => {
//   const [value, setValue] = React.useState(0);
//   return (
//     <div className="">
//       <Counter
//         // Two-way data-biding
//         // Truyền trạng thái từ component cha
//         value={value}
//         // Đồng thời truyền xuống hàm để cho phép component con cập nhật trang thái
//         onDecrement={() => setValue(value - 1)}
//         onIncrement={() => setValue(value + 1)}
//       />
//       <Square value={value} />
//     </div>
//   );
// };

/*
* Chia sẻ state giữa các component
    Nâng giá trị trạng thái lên component cha gần nhất 
    Sử dụng context để quản lý trạng thái tập trung (tránh việc phải tuyển props xuống nhiều lớp)
    Sử dụng các thư viện quản lý trạng thái (Redux ,Mobx,Recoil,...) để quản lí trạng thái
* Lifcycle
    Lifecyle - vòng đời  : Là các giai đoạn phát triển của 1 sự vật , sự việc nào đó
    các component trong React thì cũng có các giai đoạn chính :
        Mounting
        Updating
        Unmount
    Lifecycle methods - phương thức vòng đời : là phương thức được React định nghĩa và chạy khi component đạt đến giai đoạn cụ thể
    -----Mounting :
        render()
        componentDidMount()    
    -----Updating :
        componentDidUpdate()
    -----Unmount:
        compunentWillUnmount()
* Hạn chề của lifecycle methods trong class component
    Chỉ có 1 phương thức lifecycle => Khi có nhiều thao tác khác nhau cần phải chạy trong cùng 1 lifecycle
    Các lifecycle method chạy ở các giai đoạn khác nhau  => 1 thao tác phải tách ra 3 lifecycle methods
* useEffect 
    Thay thế / thực hiện lifecycle methods trong fuction component     
    Sử dụng để đồng bộ trạng thái của React Component với API bên thứ 3 (hệ thống bên ngoài) => tác dụng phụ 
    Cú pháp :
        useEffect(callback, ?dependencies);
    Khắc phục các hạn chế của lifecycle methods trong Class component
    Chạy với mỗi lần render
        useEffect (effectcallback); Không có dependencies => giống như didMouse và didUpdate
    Chạy khi 1 / nhiều giá trị thay đổi
        useEffect (effectcallback,[value2,value2,...]); => didUpdate
    Chạy 1 lần duy nhất 
        useEffect (effectcallback,[]); dependencies rỗng => didMouse
    Sau khi Component unmount 
        useEffect (()=>{
            return () =>{
                // Hàm chạy khi trước khi component re-render
            }
        })
    Lỗi thường gặp với useEffect
        1. Không truyền đúng các dependencies => xác định rõ các biến bên ngoài được sử dụng trong useEffect (bao gồm cả 1 số trường hợp biến không nằm trong useEffectb)
        2. Không có hàm return () để dọn dẹp => Khi làm việc với API

    Lần đầu tiên render => gọi API lần 1 => xong sau
    Có 1 state/props thay đổi => re-render => gọi API lần 2 => xong trước
*/

const Todo = ({ userId, id, title, completed }) => {
  return <div className="">{title}</div>;
};

const TodoType = (Todo.propsType = PropTypes.exact({
  userId: PropTypes.number,
  id: PropTypes.number,
  title: PropTypes.string,
  completed: PropTypes.bool,
}));

Todo.propTypes = TodoType;

const TodoList = ({ todos }) => {
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <Todo key={todo.id} {...todo} />
      ))}
    </div>
  );
};

TodoList.propType = {
  todos: PropTypes.arrayOf(TodoType),
};

const Box = ({ jobs, setJobs, job, setJob, onSub, todos, onDel, onClear }) => {
  const Locail = localStorage.getItem("key");
  const res = JSON.parse(Locail);
  console.log(res);
  return (
    <div className="box">
      <div className="content">
        <h1 className="text-center">Simple TodoApp</h1>
        <div className="form-field">
          <input
            value={job}
            onChange={(e) => setJob(e.target.value)}
            type="text"
            placeholder="What do you want to do ?"
          />
          <button onClick={onSub}>Create</button>
        </div>
        <div className="">
          <ul>
            {todos.map((todo, index) => (
              <li key={index}>
                {todo.title}
                <div className="delete" onClick={onDel}>
                  Delete
                </div>
              </li>
            ))}
          </ul>
          <div className="">
            <button onClick={onClear}>Clear All</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [job, setJob] = React.useState("");
  const [jobs, setJobs] = React.useState([]);
  const [todos, setTodo] = React.useState([]);
  React.useEffect(() => {
    const controller = new AbortController();
    fetch("https://jsonplaceholder.typicode.com/todos", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setTodo(data));

    return () => {
      controller.abort();
    };
  }, []);

  const handleSubmit = () => {
    setTodo((todos) => {
      const newTodos = [...todos, { title: job }];

      const jsonTodo = JSON.stringify(newTodos);

      localStorage.setItem("key", jsonTodo);

      return newTodos;
    });

    setJob("");
  };

  const handleDelete = (e) => {
    let Locial = localStorage.getItem("key");
    let res = JSON.parse(Locial);
    let deletBtn = e.target.parentElement;
    deletBtn.remove();
    res.splice(deletBtn, 1);
    localStorage.setItem("key", JSON.stringify(res));
  };

  const handleClearAll = (e) => {
    let Locial = localStorage.getItem("key");
    let res = JSON.parse(Locial);
    let deletBtn = e.target.parentElement.parentElement;
    deletBtn.remove();
    res.splice(deletBtn);
    console.log(res);
    localStorage.setItem("key", JSON.stringify(res));
  };

  return (
    <div className="">
      <Box
        jobs={jobs}
        setJobs={setJobs}
        job={job}
        setJob={setJob}
        onSub={handleSubmit}
        todos={todos}
        onDel={handleDelete}
        onClear={handleClearAll}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);
