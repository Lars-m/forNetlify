import React, { useState, useEffect } from "react";
import {
  HahsRouter as Router,
  Route,
  Link,
  NavLink,
  Switch,
  Prompt,
  useRouteMatch,
  useHistory,
  useParams,
  Redirect
} from "react-router-dom";
import "./App.css";

function Header({ isLoggedIn, loginMsg }) {
  console.log("LOGIN", loginMsg);
  return (
    <div>
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/products">
            Products
          </NavLink>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <NavLink activeClassName="active" to="/add-book">
                Add Book
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/find-book">
                Find Book
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink activeClassName="active" to="/company">
            Company
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/login-out">
            {loginMsg}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Product({ bookFactory }) {
  const [books, setBooks] = useState([]);
  const [booksChanged, setBooksChanged] = useState(false);

  useEffect(() => {
    setBooks([...bookFactory.getBooks()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booksChanged]);

  let { path, url } = useRouteMatch();
  console.log("--->", path);
  console.log("-URL->", url);

  const deleteAndRefresh = id => {
    console.log("ID", id);
    bookFactory.deleteBook(id);
    setBooksChanged(!booksChanged);
  };

  const lis = books.map(book => {
    return (
      <li key={book.id}>
        {book.title}
        &nbsp;
        <Link to={`${url}/${book.id}`}>details</Link>
        {/* ,&nbsp;
        <a
          href="/#"
          onClick={e => {
            e.preventDefault();
            deleteAndRefresh(book.id);
          }}
        >
          delete
        </a> */}
      </li>
    );
  });

  return (
    <div>
      <h2>Product</h2>
      <ul>{lis}</ul>
      {/* <p>Book details for selected book will go here</p> */}
      <Switch>
        <Route exact path={path}>
          <h3>Please select a book.</h3>
        </Route>
        <Route path={`${path}/:bookId`}>
          <Details bookFactory={bookFactory} />
        </Route>
        {/* <Route path={`${path}/delete/:bookId`}>
          <Delete bookFactory={bookFactory} />
        </Route> */}
      </Switch>
    </div>
  );
}

function Login({ isLoggedIn, loginMsg, setLoginStatus }) {
  const handleBtnClick = () => {
    setLoginStatus(!isLoggedIn);
  };
  return (
    <div>
      <h2>{loginMsg}</h2>
      <em>This simulates a real login page. Here you just need to press the button</em>
      <em>In a read application you obviously will need to add your credentials, and login via the server</em>
      <button onClick={handleBtnClick}>{loginMsg}</button>
    </div>
  );
}

function Company() {
  return (
    <div>
      <h2>Company</h2>
    </div>
  );
}
const style = {
  borderRadius: 2,
  width: 400,
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "darkGray",
  padding: 2
};
function Details({ bookFactory }) {
  const { bookId } = useParams();
  const book = bookFactory.findBook(bookId);

  const showBook = book ? (
    <div style={style}>
      <p>Title: {book.title}</p>
      <p>ID: {book.id}</p>
      <p>Info: {book.info}</p>
    </div>
  ) : (
    <p>Book not found</p>
  );
  return <div>{showBook}</div>;
}
function Delete({ bookFactory }) {
  const { bookId } = useParams();
  bookFactory.deleteBook(bookId);
  return <Redirect to="/products" />;
}

function FindBook({ bookFactory }) {
  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState(null);

  useEffect(() => {}, [book]);

  const findBook = () => {
    const foundBook = bookFactory.findBook(bookId);
    setBook(foundBook);
  };
  const deleteBook = id => {
    bookFactory.deleteBook(id);
    setBook(null);
  };
  return (
    <div style={{ margin: 4 }}>
      <input
        id="book-id"
        placeholder="Enter book Id"
        onChange={e => {
          setBookId(e.target.value);
        }}
      />
      <button onClick={findBook}>Find book</button>
      {book && (
        <div>
          <p>ID: {book.id}</p>
          <p>Title: {book.title}</p>
          <p>Info: {book.info}</p>
          <div>
            <button onClick={() => deleteBook(book.id)}>Delete Book</button>
          </div>
        </div>
      )}
      {!book && <p>Enter id for book to see</p>}
    </div>
  );
}

function AddBook({ bookFactory }) {
  const emptyBook = { id: "", title: "", info: "" };
  const [book, setBook] = useState({ ...emptyBook });
  let [isBlocking, setIsBlocking] = useState(false);

  const handleChange = e => {
    const { id, value } = e.target;
    setBook({ ...book, [id]: value });
    setIsBlocking(true);
  };
  const handleSubmit = e => {
    e.preventDefault();
    bookFactory.addBook(book);
    setBook({ ...emptyBook });
    setIsBlocking(false);
  };
  return (
    <div>
      <h2>Add Book</h2>
      <form>
        <input
          id="title"
          value={book.title}
          placeholder="Add title"
          onChange={handleChange}
        />
        <br />
        <input
          id="info"
          value={book.info}
          placeholder="Add Info"
          onChange={handleChange}
        />
        <br />
        <button onClick={handleSubmit}>Save</button>
      </form>
      <Prompt
        when={isBlocking}
        message={location =>
          `Are you sure you want to go to ${location.pathname}`
        }
      />
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>No Match found for this</h2>
    </div>
  );
}
function App({ bookFactory, match }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let history = useHistory();

  const setLoginStatus = status => {
    setIsLoggedIn(status);
    history.push("/");
  };

  return (
    <div>
      <Header
        loginMsg={isLoggedIn ? "Logout" : "Login"}
        isLoggedIn={isLoggedIn}
      />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/products">
          <Product bookFactory={bookFactory} />
        </Route>
        <Route path="/company">
          <Company />
        </Route>
        <Route path="/add-book">
          <AddBook bookFactory={bookFactory} />
        </Route>
        <Route path="/find-book">
          <FindBook bookFactory={bookFactory} />
        </Route>
        <Route path="/login-out">
          <Login
            loginMsg={isLoggedIn ? "Logout" : "Login"}
            isLoggedIn={isLoggedIn}
            setLoginStatus={setLoginStatus}
          />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
