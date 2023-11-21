import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const CommentList = (props) => {
  return (
    <>
      <List
        sx={{ width: '100%', maxWidth: '50%', bgcolor: 'background.paper' }}
      >
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt="Avatar"
              src="https://res.cloudinary.com/daz6gyr7k/image/upload/v1699448428/collectify-collection-image/default-avatar_de69ps.jpg"
            />
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{ fontSize: '20px' }}
            primary={
              <>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  fontSize="22px"
                >
                  {props.user.name}
                </Typography>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  fontSize="14px"
                  color="text.primary"
                >
                  {props.createdAt}
                </Typography>
              </>
            }
            secondaryTypographyProps={{ fontSize: '20px' }}
            secondary={
              <>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  color="text.primary"
                  fontSize="16px"
                >
                  {props.text}
                </Typography>
              </>
            }
          />
        </ListItem>
      </List>
    </>
  );
};

export default CommentList;
