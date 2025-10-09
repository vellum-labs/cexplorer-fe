import Button from "../Button";
import Modal from "../Modal";

export const SafetyLinkModal = ({ url, onClose }) => {
  return (
    <Modal minHeight='auto' minWidth='400px' maxWidth='600px' maxHeight='80vh' onClose={onClose}>
      <p className='mt-2 font-medium'>
        You are switching to an external, unmoderated url:{" "}
      </p>
      <p className='break-all overflow-wrap-anywhere max-w-full text-text-sm mt-1 mb-2 max-h-32 overflow-y-auto'>{url}</p>
      <div className='flex justify-between gap-1'>
        <Button onClick={onClose} variant='red' size='md' label='Go back' />
        <a
          onClick={onClose}
          href={url}
          target='_blank'
          rel='noreferrer noopener nofollow'
          className='box-border flex min-w-fit max-w-fit items-center justify-center rounded-[8px] border-2 border-darkBlue bg-darkBlue px-2 py-1 text-text-sm font-medium text-white duration-150 hover:scale-[101%] hover:text-white active:scale-[98%] disabled:cursor-not-allowed disabled:opacity-50'
        >
          Visit
        </a>
      </div>
    </Modal>
  );
};
