import { Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

const CollectionCard = (props) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ minWidth: 300, maxWidth: 300 }} key={props.i}>
      <CardMedia
        component="img"
        height="194"
        image={props.col.image}
        alt="collection image"
      />
      <CardHeader
        title={props.col.collectionName}
        subheader={props.col.theme}
      />
      <CardContent>
        <Typography component="div" variant="body2" color="text.secondary">
          <Box>
            {props.col.description.split(' ').slice(0, 10).join(' ') + '...'}
          </Box>
        </Typography>
      </CardContent>
      <CardActions>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Box>
            <Button
              size="small"
              onClick={() => props.handleLearnMore(props.col.id)}
            >
              {t('learn_more')}
            </Button>
          </Box>
          {(props.userId === props.currentUserInfo?.id ||
            props.currentUserInfo?.role === 'admin') && (
            <Box>
              <Button
                size="small"
                onClick={() => props.handleDelete(props.col.id)}
              >
                <DeleteIcon color="error" />
              </Button>
            </Box>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default CollectionCard;
