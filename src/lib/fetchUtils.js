import { useCoinStore } from "@/stores";
import { useHintStore } from "@/stores";

const baseURL = import.meta.env.VITE_APP_URL;

// ฟังก์ชันเพื่อตรวจสอบว่าชื่อผู้ใช้มีอยู่ในระบบหรือไม่
const checkUsernameExists = async (username) => {
  const response = await fetch(`${baseURL}/users`);
  const data = await response.json();
  return data.some((user) => user.username === username); // ตรวจสอบว่า username ซ้ำไหม
};

export const updateUserWithLocalStorage = async () => {
  const username = localStorage.getItem('currentUser'); // ดึงชื่อผู้ใช้จาก localStorage

  if (!username) {
    throw new Error('Username not found in localStorage');
  }

  // ดึงข้อมูลผู้ใช้จาก db.json ด้วย username ที่ได้จาก localStorage
  const response = await fetch(`${baseURL}/users?username=${username}`);
  const data = await response.json();
  const user = data[0]; // ถือว่า username เป็น unique

  if (!user) {
    throw new Error('The user was not found in the system.');
  }

  // ดึงข้อมูลทั้งหมดจาก localStorage
  const localStorageData = { ...localStorage }; // เก็บข้อมูลทั้งหมดจาก localStorage

  // อัปเดตข้อมูลผู้ใช้ใน db.json
  const updatedUser = {
    ...user,
    localStorageData, // เพิ่มข้อมูล localStorage ทั้งหมดลงในฟิลด์ของผู้ใช้
  };

  // ใช้คำขอ PUT เพื่ออัปเดตผู้ใช้
  const updateResponse = await fetch(`${baseURL}/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });

  return updateResponse.json();
};

export const loginUser = async (credentials) => {
  // ตรวจสอบการล็อกอิน
  const response = await fetch(`${baseURL}/users?username=${credentials.username}&password=${credentials.password}`);
  const data = await response.json();
  const user = data[0]; // สมมติว่า username/password เป็น unique

  if (!user) {
    throw new Error('The username or password is incorrect.');
  }

  // บันทึกชื่อผู้ใช้ใน localStorage
  localStorage.setItem('currentUser', user.username);

  // ตรวจสอบว่า user มี localStorageData หรือไม่
  if (user.localStorageData) {
    // นำข้อมูลจาก localStorageData ของผู้ใช้มาใส่ใน localStorage
    Object.keys(user.localStorageData).forEach((key) => {
      localStorage.setItem(key, user.localStorageData[key]);
    });
  } else {
    // ถ้าไม่มีข้อมูล localStorageData ให้ลบข้อมูลใน localStorage ทั้งหมด
    // localStorage.clear();

    // test
    localStorage.setItem('hint', 1000);
    localStorage.setItem('coin', 1000);

    alert('No information found in localStorageData, all localStorage data cleared');
  }

  return user;
};

export const createUser = async (userData) => {
  // ตรวจสอบว่าชื่อผู้ใช้มีอยู่แล้วหรือไม่
  const exists = await checkUsernameExists(userData.username);
  if (exists) {
    throw new Error('Duplicate username Please choose a new name.');
  }

  const response = await fetch(`${baseURL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

export const fetchUser = async (username) => {
  const response = await fetch(`${baseURL}/users?username=${username}`);
  const data = await response.json();
  return data[0]; // คืนค่าผู้ใช้ที่มี username ตรงกัน
};

export const updateUser = async (userData) => {
  // ตรวจสอบว่ามี userData.id และ username ใน userData หรือไม่
  if (!userData.id || !userData.username) {
    throw new Error('An id and username are required to update information.');
  }

  // อัปเดตข้อมูลผู้ใช้ใน db.json
  const response = await fetch(`${baseURL}/users/${userData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  localStorage.setItem('currentUser', `${userData.username}`);
  return response.json();
};

export const deleteUser = async (username) => {
  // ตรวจสอบว่าชื่อผู้ใช้มีอยู่ในระบบก่อนที่จะลบ
  const user = await fetchUser(username);
  
  if (!user) {
    throw new Error('User not found.');
  }

  // ส่งคำขอ DELETE เพื่อลบผู้ใช้
  const response = await fetch(`${baseURL}/users/${user.id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user.');
  }

  // ลบชื่อผู้ใช้จาก localStorage ถ้าลบสำเร็จ
  localStorage.removeItem('currentUser');
  
  return { message: 'User deleted successfully.' };
};

