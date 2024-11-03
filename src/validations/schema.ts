import { z } from "zod";

export const transactionScheme=z.object({
    type:z.enum(["income","expense"]),
    date:z.string().min(1,{message:"日付は必須です"}),
    amount:z.number().min(1,{message:"金額を入力してください"}),
    content:z.string()
    .min(1,{message:"内容を入力してください"})
    .max(50,{message:"内容は50文字以内にしてください"}),
    category:z.string()
    .min(1,{message:"カテゴリーを入力してください"})
})


export type Schema = z.infer<typeof transactionScheme>