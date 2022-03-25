import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

export class Cardnft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <Card sx={{ maxWidth: 345 }} style={{ width: "100%", textAlign: "center" }}>
                <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                    </Typography>
                </CardContent>
                <CardActions>
                    <Grid container>
                        <Grid item xs={6}>
                            <button className='personal-button-deny' style={{ width: "60%", height: "100%" }}>Sell</button>
                        </Grid>
                        <Grid item xs={6}>
                            <button className='personal-button-deny' style={{ width: "60%", height: "100%" }}>Opensea</button>
                        </Grid>
                    </Grid>

                </CardActions>
            </Card>
        )
    }
}