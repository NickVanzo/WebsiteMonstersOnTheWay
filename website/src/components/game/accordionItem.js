import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export class AccordionItemPersonal extends React.Component {
    constructor(props) {
        super(props);
    }

    customStyleForText = {
        textAlign: 'left'
    }

    customStyleForTitle = {
        textAlign: 'center'
    }

    customStyleForAccordion = {
        maxWidth: '100%',
        background: 'orange'
    }

    render() {
        return (
            <Accordion sx={this.customStyleForAccordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={this.customStyleForTitle}>{this.props.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={this.customStyleForText}>
                        {this.props.text}
                    </Typography>
                </AccordionDetails>
            </Accordion>

        )
    }
}