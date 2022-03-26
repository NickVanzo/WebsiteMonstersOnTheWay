
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

export class InteractiveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dense: false,
            secondary: false
        }
    }

    generate(array) {
        return array.map((value) =>
            <ListItem
                
            >
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon />
                    </Avatar>
                </ListItemAvatar>
                <Grid container>
                    <Grid item xs={5}>
                        <p>
                            ID: {value.id}
                        </p>
                    </Grid>
                    <Grid item xs={5}>
                        <p className='hide-on-small-screen'>
                            Duration: {value.duration}
                        </p>
                    </Grid>                    
                </Grid>
            </ListItem>
        );
    }

    render() {
        return (
            <Box>
                <Grid container>
                    <Grid item xs={1}/>
                    <Grid item xs={10}>
                        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                            <p>Your NFTs</p>
                        </Typography>
                        <div className={'nft-owned-list'}>
                            <List>
                                {this.generate(
                                    this.props.ids
                                )}
                            </List>
                        </div>
                    </Grid>
                    <Grid item xs={1}/>
                </Grid>
            </Box>
        );
    }

}



