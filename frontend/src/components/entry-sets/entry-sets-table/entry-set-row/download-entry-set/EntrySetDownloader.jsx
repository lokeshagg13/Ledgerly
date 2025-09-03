import { DownloadEntrySetContextProvider } from "../../../../../store/context/downloadEntrySetContext";
import { HeadsProvider } from "../../../../../store/context/headsContext";
import EntrySetDownloadButton from "./EntrySetDownloadButton";

function EntrySetDownloader({ entrySetId, formattedEntrySetDate }) {
  return (
    <HeadsProvider>
      <DownloadEntrySetContextProvider
        entrySetId={entrySetId}
        formattedEntrySetDate={formattedEntrySetDate}
      >
        <EntrySetDownloadButton />
      </DownloadEntrySetContextProvider>
    </HeadsProvider>
  );
}

export default EntrySetDownloader;
