import { collection, addDoc, getDocs, query, where, QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Teacher, Movie } from '@/types';

// 獲取所有教師資料
export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const teachersCollection = collection(db, 'teachers');
    const teachersSnapshot = await getDocs(teachersCollection);
    const teachersList = teachersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Teacher[];
    
    return teachersList;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

// 搜尋教師資料
export const searchTeachers = async (keyword: string): Promise<Teacher[]> => {
  try {
    const teachersCollection = collection(db, 'teachers');
    // 同時搜尋 name, department 和 position 欄位
    const nameQuery = query(teachersCollection, where('name', '>=', keyword), where('name', '<=', keyword + '\uf8ff'));
    const deptQuery = query(teachersCollection, where('department', '>=', keyword), where('department', '<=', keyword + '\uf8ff'));
    const positionQuery = query(teachersCollection, where('position', '>=', keyword), where('position', '<=', keyword + '\uf8ff'));
    
    const [nameSnapshot, deptSnapshot, positionSnapshot] = await Promise.all([
      getDocs(nameQuery),
      getDocs(deptQuery),
      getDocs(positionQuery)
    ]);

    // 合併搜尋結果並移除重複項目
    const uniqueResults = new Map<string, Teacher>();
    
    [...nameSnapshot.docs, ...deptSnapshot.docs, ...positionSnapshot.docs].forEach(doc => {
      if (!uniqueResults.has(doc.id)) {
        uniqueResults.set(doc.id, { id: doc.id, ...doc.data() } as Teacher);
      }
    });
    
    return Array.from(uniqueResults.values());
  } catch (error) {
    console.error('Error searching teachers:', error);
    throw error;
  }
};

// 添加教師資料
export const addTeacher = async (teacher: Teacher): Promise<string> => {
  try {
    const teachersCollection = collection(db, 'teachers');
    const docRef = await addDoc(teachersCollection, teacher);
    return docRef.id;
  } catch (error) {
    console.error('Error adding teacher:', error);
    throw error;
  }
};

// 添加電影資料
export const addMovie = async (movie: Movie): Promise<string> => {
  try {
    const moviesCollection = collection(db, 'movies');
    const docRef = await addDoc(moviesCollection, movie);
    return docRef.id;
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

// 獲取所有電影資料
export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const moviesCollection = collection(db, 'movies');
    const moviesSnapshot = await getDocs(moviesCollection);
    const moviesList = moviesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Movie[];
    
    return moviesList;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// 搜尋電影資料
export const searchMovies = async (keyword: string): Promise<Movie[]> => {
  try {
    const moviesCollection = collection(db, 'movies');
    // 同時搜尋 title 和 director 欄位
    const titleQuery = query(moviesCollection, where('title', '>=', keyword), where('title', '<=', keyword + '\uf8ff'));
    const directorQuery = query(moviesCollection, where('director', '>=', keyword), where('director', '<=', keyword + '\uf8ff'));
    
    const [titleSnapshot, directorSnapshot] = await Promise.all([
      getDocs(titleQuery),
      getDocs(directorQuery)
    ]);

    // 合併搜尋結果並移除重複項目
    const uniqueResults = new Map<string, Movie>();
    
    [...titleSnapshot.docs, ...directorSnapshot.docs].forEach(doc => {
      if (!uniqueResults.has(doc.id)) {
        uniqueResults.set(doc.id, { id: doc.id, ...doc.data() } as Movie);
      }
    });
    
    return Array.from(uniqueResults.values());
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}; 