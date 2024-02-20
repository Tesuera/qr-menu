import MenuSkeleton from './MenuSkeleton';
import CategorySkeleton from './CategorySkeleton';
import IndexHeaderSkeleton from './IndexHeaderSkeleton';

const IndexSkeleton = () => {
  return (
    <div>
        <IndexHeaderSkeleton />
        <CategorySkeleton />
        <div className='p-2'>
            <MenuSkeleton />
        </div>
    </div>
  )
}

export default IndexSkeleton