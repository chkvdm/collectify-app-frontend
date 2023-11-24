import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CollectionCard = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleMore() {
    navigate(`/collection/${props.collection.id}`);
  }

  return (
    <Card sx={{ minWidth: 250, maxWidth: 250 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={props.collection.image}
        title="collection img"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.collection.collectionName}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {props.collection.theme}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.collection.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleMore}>
          {t('learn_more')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CollectionCard;
