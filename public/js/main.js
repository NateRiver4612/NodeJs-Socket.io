const userList = document.getElementById("people");
const peopleQuantity = document.getElementById("people-quantity");
const avatar = document.getElementById("avatar");
const logoutBtn = document.getElementById("log-out-btn");
const offline_doc = document.getElementById("offline-notification");
const online_doc = document.getElementById("online-notification");

// Connect to socket.io
var socket = io.connect("http://localhost:5000");

//Check for connection
if (socket !== undefined) {
  console.log("Connected to socket...");

  const url = window.location.href;
  const username = url.split("=")[1];

  offline_doc.innerHTM = "";
  online_doc.innerHTML = "";

  offline_doc.addEventListener("click", () => {
    offline_doc.innerHTML = "";
  });

  online_doc.addEventListener("click", () => {
    online_doc.innerHTML = "";
  });

  //Log out event
  socket.on("leave_app", ({ user }) => {
    console.log(`${user.username} has left the app`);
    offline_doc.innerHTML = `<strong>${user.username}</strong> đã thoát khỏi ứng dụng`;
  });

  //handle login event from
  socket.on("join_notify", ({ user }) => {
    console.log(`${user.username} has join the app`);
    online_doc.innerHTML = `<strong>${user.username}</strong> vừa mới online`;
  });

  //Add log out event
  logoutBtn.addEventListener("click", () => {
    window.location = "../index.html";
  });

  // New user event
  socket.on("welcome_user", async (message) => {
    console.log(message + username);

    //Add new user
    socket.emit("add_user", username);
  });

  userList.innerHTML = " ";
  // Catch load usets event
  socket.on("load_users", async (user_list) => {
    let html = "";

    user_list.map((user) => {
      html += `<form class="user" action="chat.html">
                <div id="avatar" class="avatar">${Array.from(user.username).at(
                  0
                )}
                </div>
                <div class="user-info">
                  <div class="user-name">
                    ${
                      username == user.username
                        ? `${user.username} <span style="color:gray">(you)<span>`
                        : `${user.username}`
                    }
                    <input class="form-control" type="hidden" id="username"  name="username"  style="border:none !important"  value="${
                      user.username
                    }">
                   
                    <input class="form-control" type="hidden" id="id"  name="id"  style="border:none !important"  value="${
                      user.id
                    }">
                     <input class="form-control" type="hidden" id="current_username"  name="current_username"  style="border:none !important"  value="${username}">
                  </div>
                  <div class="online">Truy cập lúc: 16:45'</div>
                </div>
                <div class="status">
                   ${
                     user.status == "hold"
                       ? '<div class="badge badge-warning badge-pill">Chatting</div>'
                       : user.status == "true"
                       ? '<div class="badge badge-success badge-pill">Online</div>'
                       : '<div class="badge badge-danger badge-pill">Offline</div>'
                   }
                </div>
                <div>
                ${
                  username == user.username ||
                  (username != user.chat_with && user.chat_with.length > 0)
                    ? `<button class="btn btn-secondary" type="hidden" disabled type="submit" style="display:flex ;width: 100%;border: none !important;">Chat</button>`
                    : '<button class="btn btn-primary" type="submit" style="display:flex; width: 100%;border: none !important;">Chat</button>'
                }
                </div>
            </form>`;
    });

    userList.innerHTML = html;
    peopleQuantity.innerHTML = user_list.length;
  });
}
