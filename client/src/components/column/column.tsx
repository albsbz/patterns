import { colors } from '@atlaskit/theme';
import type { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { Draggable } from '@hello-pangea/dnd';

import type { Card } from '../../common/types';
import { CardsList } from '../card-list/card-list';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Title } from '../primitives/title';
import { Footer } from './components/footer';
import { Container } from './styled/container';
import { Header } from './styled/header';

type Props = {
  listId: string;
  listName: string;
  cards: Card[];
  index: number;
  onDeleteList: Function;
  onRenameList: Function;
  onCreateCard: Function;
};

export const Column = ({ listId, listName, cards, index, onDeleteList, onRenameList, onCreateCard }: Props) => {
  return (
    <Draggable draggableId={listId} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container className="column-container" ref={provided.innerRef} {...provided.draggableProps}>
          <Header className="column-header" isDragging={snapshot.isDragging} {...provided.dragHandleProps}>
            <Title
              aria-label={listName}
              title={listName}
              onChange={(name) => {
                onRenameList(listId, name);
              }}
              fontSize="large"
              width={200}
              bold
            />
            <Splitter />
            <DeleteButton
              color="#FFF0"
              onClick={() => {
                onDeleteList(listId);
              }}
            />
          </Header>
          <CardsList
            listId={listId}
            listType="CARD"
            style={{
              backgroundColor: snapshot.isDragging ? colors.G50 : '',
            }}
            cards={cards}
          />
          <Footer
            onCreateCard={(cardName) => {
              onCreateCard(listId, cardName);
            }}
          />
        </Container>
      )}
    </Draggable>
  );
};
