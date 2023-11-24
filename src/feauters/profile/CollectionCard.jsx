import { Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

const CollectionCard = (props) => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <Card sx={{ minWidth: 300, maxWidth: 300 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={props.col.image}
          title="collection img"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.col.collectionName}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
            {props.col.theme}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap="true">
            {props.col.description}
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
    </div>
  );
};

export default CollectionCard;
