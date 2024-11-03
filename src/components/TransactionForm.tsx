import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FastFoodIcon from "@mui/icons-material/Fastfood";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExpenseCategory, incomeCategory, Transaction } from "../types";
import { AddBusiness, AddHome, Alarm, Diversity3, Savings, SportsTennis, Train, Work } from "@mui/icons-material";
import {zodResolver} from "@hookform/resolvers/zod"
import { Schema,transactionScheme } from "../validations/schema";
import WaterDropIcon from '@mui/icons-material/WaterDrop';interface TransactionFormProps{
  onCloseForm:()=> void
  isEntryDrawerOpen : boolean
  currentDay:string
  onSaveTransaction:(transaction: Schema) => Promise<void>,
  selectedTransaction:Transaction | null,
  onDeleteTransaction: (transactionId: string) => Promise<void>,
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>
  onUpdateTransaction:(transaction: Schema, transactionId: string) => Promise<void>
  isMobile:boolean,
  isDialogOpen:boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type IncomeExpense ="income" | "expense"

interface CategoryItem{
  label:incomeCategory | ExpenseCategory;
  icon:JSX.Element;

}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  onSaveTransaction,
  selectedTransaction,
  onDeleteTransaction,
  setSelectedTransaction,
  onUpdateTransaction,
  isMobile,
  isDialogOpen,
  setIsDialogOpen
}:TransactionFormProps) => {
  const formWidth = 320;
  const expenseCategories:CategoryItem[] =[
    {label:"食費",icon:<FastFoodIcon fontSize="small"/>},
    {label:"日用品",icon:<Alarm fontSize="small"/>},
    {label:"住居費",icon:<AddHome fontSize="small"/>},
    {label:"交際費",icon:<Diversity3 fontSize="small"/>},
    {label:"娯楽",icon:<SportsTennis fontSize="small"/>},
    {label:"交通費",icon:<Train fontSize="small"/>},
    {label:"水道光熱費",icon:<WaterDropIcon fontSize="small"/>},
  ]
  const incomeCategories:CategoryItem[]=[
    {label:"給与",icon:<Work fontSize="small"/>},
    {label:"副収入",icon:<Savings fontSize="small"/>},
    {label:"お小遣い",icon:<AddBusiness fontSize="small"/>},
  ]

  const [categories,setCategories] = useState(expenseCategories);

  const {control,setValue,watch,formState:{errors},handleSubmit,reset}= useForm<Schema>({
    defaultValues:{
      type:"expense",
      date:currentDay,
      amount:0,
      category:"",
      content:""
    },
    resolver:zodResolver(transactionScheme)
  })
  //収支タイプの切り替え
const incomeExpenseToggle =(type:IncomeExpense)=>{
  setValue("type",type);
  setValue("category","");
};

const currentType = watch("type");

useEffect(()=>{
  const newCategories=currentType==="expense" ? expenseCategories:incomeCategories
  setCategories(newCategories);
},[currentType])

useEffect(()=>{
  setValue("date",currentDay);
},[currentDay])

//送信処理
const onSubmit:SubmitHandler<Schema> =(data)=>{
  if(selectedTransaction){
    onUpdateTransaction(data,selectedTransaction.id)
    .then(()=>{
      setSelectedTransaction(null);
      if(isMobile){
        setIsDialogOpen(false);
      }
    })
    .catch((error)=>{
      console.error(error)
    })
  }else{
    onSaveTransaction(data)
      .then(()=>{
        console.log("保存しました");
      })
      .catch((error)=>{
        console.error(error);
      })
  }
  reset({
      type:"expense",
      date:currentDay,
      amount:0,
      category:"",
      content:""
  })
}

useEffect(()=>{
  if(selectedTransaction){
    const categoryExists = categories.some((category)=>category.label ===selectedTransaction.category);
    setValue("category",categoryExists ? selectedTransaction.category:"");
  }

},[selectedTransaction,categories])

useEffect (()=>{
  if(selectedTransaction){
    setValue("type",selectedTransaction.type);
    setValue("date",selectedTransaction.date);
    setValue("amount",selectedTransaction.amount);
    setValue("content",selectedTransaction.content);
  }else{
    reset({
      type:"expense",
      date:currentDay,
      amount:0,
      category:"",
      content:""
    })
  }
},[selectedTransaction]);

//削除送信
const handleDelete =()=>{
  if(selectedTransaction){
    onDeleteTransaction(selectedTransaction.id);
    if(isMobile){
      setIsDialogOpen(false);
    }
    setSelectedTransaction(null);
  }
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
    },
  },
};

const formContent =(
<>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
        onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
          name="type"
          control={control}
          render={({field})=>(
            <ButtonGroup fullWidth>
            <Button variant={field.value ==="expense" ? "contained" : "outlined"} color="error" onClick={() => incomeExpenseToggle("expense")}>
              支出
            </Button>
            <Button  onClick={() => incomeExpenseToggle("income")}
              color={"primary"}
              variant={field.value ==="income" ? "contained" : "outlined"}
              >収入</Button>
          </ButtonGroup>
          )}
          />

          {/* 日付 */}
          <Controller
          name="date"
          control={control}
          render={({field})=>(
            <TextField
            {...field}
            label="日付"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        )}
          />

          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.category}>
                <InputLabel id="カテゴリ">カテゴリ</InputLabel>
                <Select
                  {...field}
                  labelId="カテゴリ"
                  label="カテゴリ"
                  MenuProps={menuProps}
                >
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category.label}>
                      <ListItemIcon>{category.icon}</ListItemIcon>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <p>{errors.category.message}</p>}
              </FormControl>
            )}
          />

          {/* 金額 */}
          <Controller
          name="amount"
          control={control}
          render={({field})=>(
            <TextField
            error={!!errors.amount}
            helperText={errors.amount?.message}
              {...field}
              label="金額"
              type="number"
              value={field.value === 0 ? "": field.value}
              onChange={(e)=>{
              const newValue = parseInt(e.target.value) || 0;
              field.onChange(newValue)
              }}
              />
          )}
          />

          {/* 内容 */}
          <Controller
          name="content"
          control={control}
          render={({field})=>(
            <TextField
            error={!!errors.content}
            helperText={errors.content?.message}
            {...field} label="内容" type="text" />
          )}
          />

          {/* 保存ボタン */}
          <Button type="submit" variant="contained" color={currentType === "income" ? "primary" :"error"} fullWidth>
            {selectedTransaction ? "更新" :"保存"}
          </Button>
          {selectedTransaction &&(
            <Button variant="outlined" color={"secondary"} fullWidth onClick={handleDelete}>
              削除
            </Button>
          )}

        </Stack>
      </Box>
</>
);

  return (
    <>
    {isMobile ? (
      <Dialog open={isDialogOpen} onClose={onCloseForm} fullWidth maxWidth={"sm"}>
        <DialogContent>
          {formContent}
        </DialogContent>
      </Dialog>
    ):(
    <Box
      sx={{
        position: "fixed",
        top: 64,
        right: isEntryDrawerOpen ? formWidth:"-2%", // フォームの位置を調整
        width: formWidth,
        height: "100%",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create("right", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2, // 内部の余白
        boxSizing: "border-box", // ボーダーとパディングをwidthに含める
        boxShadow: "0px 0px 15px -5px #777777",
      }}
    >
    {formContent}
    </Box>
    )}
    </>
  );
};
export default TransactionForm;