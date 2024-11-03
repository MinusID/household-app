import { Box, Card, CardContent, Grid, Typography, useTheme } from "@mui/material";
import { Transaction} from "../types";
import { financeCalculations } from "../utils/financeCallculations";
import { formatCurrency } from "../utils/formatting";

interface DailySummaryProps{
  dailyTransactions:Transaction[],
  columns:number
}

const DailySummary = ({dailyTransactions,columns}:DailySummaryProps) => {
  const {income,expense,balance}=financeCalculations(dailyTransactions)
  const isThreeColumnsLayout = columns ===3;

  const theme = useTheme(); // テーマを取得

  return (
    <Box>
      <Grid container spacing={2}>
        {/* 収入 */}
        <Grid item xs={isThreeColumnsLayout ? 4 : 6} display={"flex"}>
          <Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                収入
              </Typography>
              <Typography
                color={theme.palette.incomeColor.main} // ここを修正
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all" }}
              >
                ¥{formatCurrency(income)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 支出 */}
        <Grid item xs={isThreeColumnsLayout ? 4 : 6} display={"flex"}>
          <Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                支出
              </Typography>
              <Typography
                color={theme.palette.expenseColor.main} // ここを修正
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all" }}
              >
                ¥{formatCurrency(expense)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 残高 */}
        <Grid item xs={isThreeColumnsLayout ? 4 : 12} display={"flex"}>
          <Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                残高
              </Typography>
              <Typography
                color={theme.palette.balanceColor.main} // ここを修正
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all" }}
              >
                ¥{formatCurrency(balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DailySummary;
