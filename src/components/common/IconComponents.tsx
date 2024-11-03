import React from 'react'
import FastFood from "@mui/icons-material/Fastfood";
import Alarm from "@mui/icons-material/Alarm";
import AddHome from "@mui/icons-material/AddHome";
import { ExpenseCategory, incomeCategory } from '../../types';
import { AddBusiness, Diversity1, Savings, SportsTennis, Train, WaterDrop, Work } from '@mui/icons-material';

const IconComponents:Record<incomeCategory | ExpenseCategory,JSX.Element> = {
  食費:<FastFood fontSize='small' />,
  日用品:<Alarm fontSize="small" />,
  住居費:<AddHome fontSize="small"/>,
  交際費:<Diversity1 fontSize='small' />,
  娯楽:<SportsTennis fontSize='small' />,
  交通費:<Train fontSize='small'/>,
  給与:<Work fontSize='small' />,
  副収入:<AddBusiness fontSize='small'/>,
  お小遣い:<Savings fontSize='small'/>,
  水道光熱費:< WaterDrop fontSize='small'/>
};

export default IconComponents