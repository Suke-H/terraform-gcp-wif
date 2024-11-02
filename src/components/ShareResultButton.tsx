import React, { useState, useRef } from 'react';
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type Props = {
    resultText: string;
  };

const shareStyle: React.CSSProperties = {
    marginBottom: "40px",
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    color: "rgb(88, 88, 88)",

    fontFamily:  ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"].join(','),
};

export const ShareResultButton = (props: Props): JSX.Element => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // スナックバーのスタイルを動的に計算
    const snackbarStyle: React.CSSProperties = buttonRef.current
    ? {
        position: 'absolute',
        top: `${buttonRef.current.offsetTop - 60}px`, // ボタンの上に配置
        left: '50%', // ビューポートの中央
        transform: 'translate(-50%, 0)', // 要素の幅の半分だけ左にずらす
    }
    : {};
    
    const handleCopyText = () => {
        const textToCopy = props.resultText; // コピーしたいテキスト
        navigator.clipboard.writeText(textToCopy).then(() => {
            setOpenSnackbar(true);
        }).catch(err => {
          console.error('テキストのコピーに失敗しました:', err);
        });
    };

      // スナックバーを閉じる関数
    const handleCloseSnackbar = (_event: Event | React.SyntheticEvent<unknown, Event>, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
        return; // クリックアウェイ時はスナックバーを閉じない
        }
        setOpenSnackbar(false);
    };

    return (
        <div style={shareStyle}>
            <Button
                ref={buttonRef}
                variant="contained"
                onClick={handleCopyText}
                sx={{
                textTransform: "none",
                backgroundColor: "#585858",
                padding: "10px 30px",
                fontSize: "20px",
                "&:hover": {
                    backgroundColor: "#585858",
                },
                }}
                startIcon={<ContentCopyIcon />} // アイコンをボタンの前に追加
            >
                Share
            </Button>

        <Snackbar
            style={snackbarStyle}
            open={openSnackbar}
            autoHideDuration={2000} 
            onClose={handleCloseSnackbar}
            message="Copied!" 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
        />
        </div>
    )

}
  