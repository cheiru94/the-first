import { StoryType } from '@/types/StoryType';
import { baseAxios } from '@axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const variants = {
  hover: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
  click: {
    border: '3px dotted #fff',
    transition: {
      border: {
        duration: 1,
        type: 'spring',
      },
    },
  },
  imageClick: {
    zIndex: 10,
    scale: 100,
    transition: {
      duration: 1,
      type: 'linear',
    },
  },
};

const Story = () => {
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  const [clickedStory, setClickedStory] = useState<number | null>(null);
  const [story, setStory] = useState<StoryType[]>([]);
  const navigate = useNavigate();

  const getStory = async () => {
    try {
      const { data } = await baseAxios.get('/story');
      setStory(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStory();
  }, []);

  return (
    <Container>
      <Wrapper>
        {story?.map((item) => (
          <StoryCard key={item.id}>
            <StoryProfile
              onMouseEnter={() => setHoveredStory(item.id)}
              onMouseLeave={() => setHoveredStory(null)}
              onClick={() => {
                setClickedStory(item.id);
                setTimeout(() => {
                  setClickedStory(null);
                  navigate(`/story/${item.id - 1}`);
                }, 500);
              }}
            >
              <StroyCircle
                variants={variants}
                initial={false}
                animate={
                  (hoveredStory === item.id ? 'hover' : '') ||
                  (clickedStory === item.id ? 'click' : '')
                }
              />

              <StoryImage
                variants={variants}
                initial={false}
                animate={clickedStory === item.id ? 'imageClick' : ''}
                isClick={clickedStory === item.id}
              >
                <img src={item.img} alt="" />
              </StoryImage>
            </StoryProfile>

            <StoryName>{item.name}</StoryName>
          </StoryCard>
        ))}
      </Wrapper>
    </Container>
  );
};

export default Story;

const Container = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const StoryCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
`;

const StoryProfile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 0.4rem;
`;

const StoryImage = styled(motion.div)<{ isClick?: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  z-index: 0;
  overflow: hidden;
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: ${({ isClick }) => (isClick ? 0 : 1)};
  }
`;

const StroyCircle = styled(motion.div)`
  position: absolute;
  width: 4.1rem;
  height: 4.1rem;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(to right, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
  background-origin: border-box;
  background-clip: content-box, border-box;
`;

const StoryName = styled.div`
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
