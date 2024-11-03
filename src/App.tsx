import React, { useEffect, useState } from 'react';
import './App.css';
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import {theme} from './theme/theme'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Transaction } from './types/index';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';

function App() {
  //firestoreがerrorかどうか判定するガード
  function isFireStoreError(err:unknown):err is {code: string , message:string}{
    return typeof err == "object" && err !== null && "code" in err
  }

  const  [transactions,setTransactions]=useState<Transaction[]>([]);
  const[currentMoth,setCurrentMoth] = useState(new Date());

  useEffect(()=>{
    const fecheTransactions = async () =>{
      try{
        const querySnapshot = await getDocs(collection(db,"Transactions"))
        const transactionsData = querySnapshot.docs.map((doc)=>{

          return{
            ...doc.data(),
            id:doc.id,
          } as Transaction
        });
        setTransactions(transactionsData)
      }catch(err){
        if(isFireStoreError(err)){
          console.error("fireStoreのエラー:",err)
        } else{
          console.error("一般的なエラーは:",err)
        }
      }
    }
    fecheTransactions();
  },[])

  const monthlyTransactions = transactions.filter((transaction)=>{
    return transaction.date.startsWith(formatMonth(currentMoth))
  })

  //取引保存処理
  const handleSaveTransaction = async(transaction:Schema) =>{
    try{
      const docRef = await addDoc(collection(db, "Transactions"),transaction);
      console.log("Document written with ID: ", docRef.id);

      const newTransaction={
        id:docRef.id,
        ...transaction
      } as Transaction
      setTransactions(prevTransaction =>[...prevTransaction,newTransaction]);
    }catch(err){
      if(isFireStoreError(err)){
        console.error("firestoreのエラー:",err)
      } else{
        console.error("一般的なエラーは:",err)
      }
    }
  }
  //取引削除処理
  const handleDeleteTransaction = async(transactionId:string)=>{
    try{
      await deleteDoc(doc(db, "Transactions", transactionId));
      const filterdTransactions = transactions.filter((transaction)=>transaction.id !==transactionId);
      setTransactions(filterdTransactions)
    }catch(err){
      if(isFireStoreError(err)){
        console.error("firestoreのエラー:",err)
      } else{
        console.error("一般的なエラーは:",err)
      }
    }
  }
const handlUpdateTransaction =async(transaction:Schema,transactionId:string)=>{
  try{
    //更新処理
    const docRef = doc(db, "Transactions", transactionId);
    await updateDoc(docRef, transaction);
    const updateTransactions = transactions.map((t)=>t.id===transactionId ? {...t,...transaction}:t)as Transaction[]
    setTransactions(updateTransactions);
  }catch(err){
      if(isFireStoreError(err)){
        console.error("firestoreのエラー:",err)
      } else{
        console.error("一般的なエラーは:",err)
      }
    }
}
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Router>
      <Routes>
          <Route path="/" element={<AppLayout />} >
            <Route index element={
              <Home
                monthlyTransactions={monthlyTransactions}
                setCurrentMoth={setCurrentMoth}
                onSaveTransaction={handleSaveTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                onUpdateTransaction={handlUpdateTransaction}
            />}/>
            <Route path="/report" element={<Report />}/>
            <Route path="*" element={<NoMatch />}/>
          </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
