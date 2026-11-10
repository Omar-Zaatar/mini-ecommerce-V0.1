import React from 'react';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function ExportButton({ onClick, disabled }) {
    return (
        <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={onClick}
            disabled={disabled}
        >
            Export PDF
        </Button>
    );
}

export default ExportButton;