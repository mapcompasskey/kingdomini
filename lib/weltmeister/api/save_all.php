<?php

if ($result['error'] == 0 && $success && $path)
{
    // {"error":0,"path":"..\/..\/..\/lib\/game\/levels\/village1.js"}
    // $result['path'] = $path;
    
    // ../../../lib/game/levels
    $levelsDir = substr($path, 0, strrpos($path, '/'));
    // $result['levelsDir'] = $levelsDir;
    
    // ../../../lib/game
    $gameDir = substr($levelsDir, 0, strrpos($levelsDir, '/'));
    // $result['gameDir'] = $gameDir;
    
    // ../../../lib/game/levels.js
    $levelsJS = $gameDir . '/levels.js';
    // $result['levelsJS'] = $levelsJS;
    
    $result['levels'] = false;
    if (file_exists($levelsJS))
    {
        $str  = 'ig.module( \'game.levels\' )' . "\r";
        $str .= '.defines(function(){' . "\r";
        
            $dir = array();
            if ($handle = opendir($levelsDir))
            {
                while (false !== ($entry = readdir($handle)))
                {
                    if ($entry != "." && $entry != "..")
                    {
                        $file = $levelsDir . '/' . $entry;
                        if (file_exists($file))
                        {
                            if ($content = @file_get_contents($file))
                            {
                                $search = "/ig.module(.*)defines\(function\(\)\{(.*)\}\);/is";
                                $content = preg_replace($search, "$2", $content);
                                $str .= $content;
                            }
                        }
                        $dir[] = $file;
                    }
                }
                closedir($handle);
            }
            $result['dir'] = $dir;
        
        $str .= '});';
        
        if (@file_put_contents($levelsJS, $str))
        {
            $result['levels'] = true;
        }
    }
    
}