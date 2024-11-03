import { Box, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calendar from '../components/Calendar'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction } from '../types'
import { format } from 'date-fns'
import { Schema } from '../validations/schema'
import { useTheme } from '@mui/material/styles';
import { DateClickArg } from '@fullcalendar/interaction'

interface HomeProps{
  monthlyTransactions:Transaction[]
  setCurrentMoth: React.Dispatch<React.SetStateAction<Date>>,
  onSaveTransaction:(transaction: Schema) => Promise<void>,
  onDeleteTransaction:(transactionId: string) => Promise<void>,
  onUpdateTransaction:(transaction: Schema, transactionId: string) => Promise<void>
}

const Home = ({monthlyTransactions,setCurrentMoth,onSaveTransaction,onDeleteTransaction,onUpdateTransaction}:HomeProps) => {
  const today = format (new Date(),"yyyy-MM-dd");
  const [currentDay,setCurrentDay]=useState(today)
  const [isEntryDrawerOpen,setIsEntryDrawerOpen] = useState(false);
  const[selectedTransaction,setSelectedTransaction]=useState<Transaction|null>(null);
  const[isMobileDrawerOpen,setIsMobileDrawerOpen]=useState(false)
  const [isDialogOpen,setIsDialogOpen] = useState(false)
  const theme =useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

//一日分のデータ取得
  const dailyTransactions= monthlyTransactions.filter((transaction)=>{
    return transaction.date === currentDay;
  });

  const CloseForm =()=>{
    setSelectedTransaction(null);
    if(isMobile){
      setIsDialogOpen(!isDialogOpen)
    }else{
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  }
  //フォームの開閉処理
  const handleAddTransactionForm =()=>{
    if (isMobile){
      setIsDialogOpen(true)
    }else{
      if(selectedTransaction){
        setSelectedTransaction(null);
      }
      else{
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }

  }
  //モバイル用Drawerを閉じる関数
  const handleCloseMobileDrawer =()=>{
    setIsMobileDrawerOpen(false)
  }
  //取引が選択されたときの処理
  const handleSelectTransaction =(transaction:Transaction)=>{
    setSelectedTransaction(transaction);
    if(isMobile){
      setIsDialogOpen(true)
    }else{
      setIsEntryDrawerOpen(true);
    }
  }

  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
  };

  return (
    <Box sx={{display: "flex"}}>
        {/*左側コンテンツ*/}
        <Box sx={{flexGrow: 1}}>
            <MonthlySummary
            monthlyTransactions={monthlyTransactions}
            />
            <Calendar
            monthlyTransactions={monthlyTransactions}
            setCurrentMoth={setCurrentMoth}
            setCurrentDay={setCurrentDay}
            currentDay={currentDay}
            today={today}
            onDateClick={handleDateClick}
              />
        </Box>

        {/*右側コンテンツ*/}
        <Box>
            <TransactionMenu
            dailyTransactions={dailyTransactions}
            currentDay={currentDay}
            onAddTransactionForm={handleAddTransactionForm}
            onSelectTransaction={handleSelectTransaction}
            isMobile={isMobile}
            Open={isMobileDrawerOpen}
            Close={handleCloseMobileDrawer}
            />
            <TransactionForm
            onCloseForm={CloseForm}
            isEntryDrawerOpen ={isEntryDrawerOpen}
            currentDay={currentDay}
            onSaveTransaction={onSaveTransaction}
            selectedTransaction={selectedTransaction}
            onDeleteTransaction={onDeleteTransaction}
            setSelectedTransaction={setSelectedTransaction}
            onUpdateTransaction={onUpdateTransaction}
            isMobile={isMobile}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            />
        </Box>

    </Box>
  )
}

export default Home