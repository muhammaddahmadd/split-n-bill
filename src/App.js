import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Abdul Rehman",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Tayyba",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Asfund",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);

  const [showAddFren, setShowAddFrem] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleShowAddFren() {
    setShowAddFrem(!showAddFren);
  }
  function handleAddFriend(friend) {
    setFriends([...friends, friend]);
    setShowAddFrem((showAddFren) => !showAddFren);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFrem(false);
  }

  function handlerSplit(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFren && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFren}>
          {showAddFren ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          onSplitBill={handlerSplit}
          selectedFriend={selectedFriend}
        />
      )}
    </div>
  );
}
function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((fren) => (
        <Friend
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          fren={fren}
          key={fren.id}
          name={fren.name}
          id={fren.id}
          url={fren.image}
          balance={fren.balance}
        />
      ))}
    </ul>
  );
}

function Friend({ fren, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === fren.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={fren.image} alt={fren.name} />
      <h3>{fren.name}</h3>

      {fren.balance < 0 && (
        <p className="red">
          You owe {fren.name} {Math.abs(fren.balance)}$
        </p>
      )}
      {fren.balance > 0 && (
        <p className="green">
          {fren.name} owes you {Math.abs(fren.balance)}$
        </p>
      )}
      {fren.balance === 0 && <p>You and {fren.name} are even</p>}
      <Button onClick={() => onSelection(fren)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newfriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newfriend);

    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <lable>Img Url</lable>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill - paidByUser;
  const [whoIsPaying, setWhoisPaying] = useState("");
  function handleBillSplitSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleBillSplitSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <lable>Bill Value</lable>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <lable>Your expense</lable>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <lable>Friend's expense</lable>
      <input type="text" disabled value={!paidByFriend ? "" : paidByFriend} />
      <lable>Who is paying the bill</lable>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoisPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
