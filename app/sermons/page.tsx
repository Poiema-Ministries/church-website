import { SERMONS } from '../common/mock/sermons';
import { Sermon } from '../common/types/models';
import SermonItem from './sermon-item';

export default function Sermons() {
  const renderSermons = () => {
    return SERMONS.response.map((sermon: Sermon) => {
      return <SermonItem sermon={sermon} key={sermon.id} />;
    });
  };

  return (
    <div className='flex flex-col min-h-screen w-full gap-2'>
      <div className='flex flex-col items-start w-full max-w-xl'>
        <h1 className='text-4xl font-bold text-center mt-10 ml-4 md:ml-8'>
          Sermons
        </h1>
      </div>
      <div className='flex flex-col items-start w-full px-4 sm:px-6 md:px-8'>
        {renderSermons()}
      </div>
    </div>
  );
}
